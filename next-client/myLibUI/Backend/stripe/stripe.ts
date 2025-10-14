import Stripe from "stripe"
import axios from "axios"
import { SupabaseTable,supabase } from "../supabase/supabase"

import {
    type StripeProps,
    type CreateCheckoutSessionProps, 
    type CreateUserProps 
} from "./stripe_types"
import { MailTable } from "../supabase/sb_tables"

const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
const stripeSecretAPIkey = process.env.STRIPE_SECRET_KEY

if (!stripePublicKey) throw new Error("No NEXT_PUBLIC_STRIPE_PUBLIC_KEY in env")
if (!stripeSecretAPIkey) throw new Error("No STRIPE_SECRET_KEY in env")

const stripe = new Stripe(stripeSecretAPIkey,{
            apiVersion: "2025-09-30.clover",
            typescript: true
        })

interface StripeSupabase {
    user_id:string, // supabase user id
    email:string,
    stripe_id:string | null,
    subscriptions:Array<{priceId:string,status:"active" | "canceled" | "past_due",startDate:string,endData:string}>
}

export class StripeHandler<T extends StripeSupabase> { 
    public products:object | undefined = undefined
    public dataTable:SupabaseTable<T>
    private public_key:string
    private stripe:Stripe

    constructor({products,secret_key,public_key,dataTable}:StripeProps<T>) {
        this.products = products
        this.public_key = public_key
        this.dataTable = dataTable
        this.stripe = new Stripe(secret_key,{
            apiVersion: "2025-09-30.clover",
            typescript: true
        })

    }

    async createCheckoutSession({mode = "subscription",products,successUrl,cancelUrl,customerEmail,clientReferenceId,customerId}:CreateCheckoutSessionProps) {
        try{
            const productPrice = (this.products ? this.products : products as any)[clientReferenceId as string]?.priceId
            const session = await this.stripe.checkout.sessions.create({

                client_reference_id: clientReferenceId,
                customer_email: customerEmail,
                customer:customerId,

                mode: mode,
                payment_method_types: ['card'], //mach hier noch weitere methods wie apple-pay usw...
                line_items: [{price:productPrice,quantity:1}],
                success_url: successUrl,
                cancel_url: cancelUrl,
                locale: 'de',
                
            })
            return session
        }catch(error){
            console.log("Error creating checkout session:", error)
            throw error
        }
    }

    async createCustomer({email,supabaseId = "none"}:CreateUserProps) {
        try{
            const customer = await this.stripe.customers.create({
                email: email,
                metadata: {supabaseId:supabaseId}
            })
            return customer
        }catch(error){
            console.log("Error creating customer:", error)
            throw error
        }
    }

    async handleWebhook(req:Request){
        const sig = req.headers.get("stripe-signature")
        const body = await req.text()
        const webhookSecret = this.public_key; if (!webhookSecret) throw new Error("No public_key")

        let event: Stripe.Event
        try {
            event = this.stripe.webhooks.constructEvent(body, sig as string, webhookSecret)
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`, err)
            return new Response(`Webhook Error: ${err}`, { status: 400 })
        }
        switch (event.type){

        }
        switch(event.type){
            case "checkout.session.completed":
                console.log("Checkout session completed")
                const session = event.data.object as Stripe.Checkout.Session
                const user_id = session.customer
                //bla bla bla, mach das mal wenn du das brauchst
                break;
            case "invoice.paid":
                // Subscription aktiv setzen
                break;
            case "invoice.payment_failed":
                // Subscription past_due setzen
                break;
            case "customer.subscription.deleted":
                // Subscription canceled setzen
                break;
                }
    }
}

const stripeHandler = new StripeHandler<StripeSupabase>({ //einfacher simpler dummy
    secret_key:stripeSecretAPIkey,
    public_key:stripePublicKey,
    dataTable:new SupabaseTable("test")
})

export async function handleSession({backend, productKey}: {backend: string, productKey: string}) {
    const respo = await axios.post(backend,{
        productKey:productKey
    })
    window.location.href = respo.data.url
}

export async function addStripeID<T extends StripeSupabase>({table}:{table:SupabaseTable<T>}){

    /* mach vorher ein checkup ob der user schon eine stripe-id hat, sonst kann es zu race-conditions kommen */

    const { data:{ user }, error:getUserError } = await supabase.auth.getUser()
    if(getUserError) throw new Error("Error beim user kriegen in der 'addStripeID' function, Error: " + getUserError)
    
    const SupabaseUserId = user?.id
    if (!SupabaseUserId) throw new Error("No user ID found")
    
    const email_arr = await table.select({
        columns:["email" as keyof T],
        where:[{column:"user_id" as keyof T, is:SupabaseUserId}]
    })
    if(email_arr.length === 0) throw new Error("user mit der id: " + SupabaseUserId + " hat keine Mail!")
    
    const email = (email_arr[0] as any).email as string
    if (!email) throw new Error("No email found for user")
    
    const stripeCustomer = await stripe.customers.create({
        email: email,
        metadata:{ supabaseID: SupabaseUserId }
    })
    
    await table.update({
        where:[{column:"user_id" as keyof T, is:SupabaseUserId}],
        update:{stripe_id:stripeCustomer.id} as Partial<T>
    })

}

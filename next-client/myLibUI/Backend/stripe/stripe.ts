import Stripe from "stripe"
import axios from "axios"
import {
    type StripeProps,
    type CreateCheckoutSessionProps, 
    type CreateUserProps 
} from "./stripe_types"

const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
const stripeSecretAPIkey = process.env.STRIPE_SECRET_KEY

if (!stripePublicKey) throw new Error("No NEXT_PUBLIC_STRIPE_PUBLIC_KEY in env")
if (!stripeSecretAPIkey) throw new Error("No STRIPE_SECRET_KEY in env")

export const stripe = new Stripe(stripeSecretAPIkey, {
    apiVersion: "2025-09-30.clover", // benutze immer die neuste api version
})

export class StripeHandler {

    public products:object
    private stripeInstance:Stripe

    constructor({products,stripeInstance = stripe}:StripeProps) {
        this.products = products
        this.stripeInstance = stripeInstance
    }

    async createCheckoutSession({mode = "subscription",successUrl,cancelUrl,customerEmail,clientReferenceId,customerId}:CreateCheckoutSessionProps) {
        try{
            const productPrice = (this.products as any)[clientReferenceId as string]?.priceId
            const session = await this.stripeInstance.checkout.sessions.create({

                client_reference_id: clientReferenceId,
                customer_email: customerEmail,
                customer:customerId,

                mode: mode,
                payment_method_types: ['card'],
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

    async createCustomer({email,existingCustomerId,supabaseId = "none"}:CreateUserProps) {
        if(existingCustomerId){
            console.log("Customer already exists with id:", existingCustomerId)
            return "customer already exists"
        }
        try{
            const customer = await this.stripeInstance.customers.create({
                email: email,
                metadata: {supabaseId:supabaseId}
            })
            return customer
        }catch(error){
            console.log("Error creating customer:", error)
            throw error
        }
    }
}

export async function handleSession({backend, productKey}: {backend: string, productKey: string}) {
    const respo = await axios.post(backend,{
        productKey:productKey
    })
    window.location.href = respo.data.url
}

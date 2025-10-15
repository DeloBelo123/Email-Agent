import Stripe from "stripe"
import { loadStripe } from "@stripe/stripe-js"
import axios from "axios"
import { SupabaseTable,supabase } from "../supabase/supabase"
import {
    type StripeProps,
    type CreateCheckoutSessionProps, 
    type CreateUserProps,
    type StripeSupabase,
    type status
} from "./stripe_types"

const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC
const stripeSecretAPIKey = process.env.STRIPE_SECRET_KEY
const stripeWebhookKey = process.env.STRIPE_WEBHOOK_KEY

if (!stripePublicKey) throw new Error("No NEXT_PUBLIC_STRIPE_PUBLIC in env")
if (!stripeSecretAPIKey) throw new Error("No STRIPE_SECRET_KEY in env")
if (!stripeWebhookKey) throw new Error("No STRIPE_WEBHOOK_KEY in env")

export const stripe = new Stripe(stripeSecretAPIKey,{
            apiVersion: "2025-09-30.clover",
            typescript: true
        })

export class StripeHandler<T extends StripeSupabase = StripeSupabase> { 
    public products:object | undefined = undefined
    public dataTable:SupabaseTable<T>
    private webhook_key:string
    private stripe:Stripe

    constructor({products,secret_key,webhook_key,dataTable}:StripeProps<T>) {
        this.products = products
        this.webhook_key = webhook_key
        this.dataTable = dataTable
        this.stripe = new Stripe(secret_key,{
            apiVersion: "2025-09-30.clover",
            typescript: true
        })

    }
    
    async createCheckoutSession({mode = "subscription",products,successUrl,cancelUrl,customerEmail,clientReferenceId,customerId}:CreateCheckoutSessionProps) {
        try{
            const productPrice = (this.products ? this.products : products as any)[clientReferenceId as string]?.priceId
            console.warn("stelle sicher, das du eine user id hast bevor du eine session erstellst")
            const session = await this.stripe.checkout.sessions.create({
                client_reference_id: clientReferenceId ?? undefined,
                customer_email: customerEmail ?? undefined,
                customer: customerId ?? undefined,

                mode: mode,
                payment_method_types: [
                    'card',           // 💳 Kredit-/Debitkarten (Visa, Mastercard, etc.)
                    'klarna',         // 🛒 Klarna (Buy now, pay later - sehr beliebt in DE)
                    'sofort',         // 🇩🇪 Sofort (Direktbanking - sehr beliebt in Deutschland)
                    'sepa_debit',     // 🇪🇺 SEPA Lastschrift (Europa)
                    'ideal',          // 🇳🇱 iDEAL (Niederlande)
                    'bancontact',     // 🇧🇪 Bancontact (Belgien)
                    'eps',            // 🇦🇹 EPS (Österreich)
                    'giropay',        // 🇩🇪 Giropay (Deutschland)
                    'apple_pay',      // 🍎 Apple Pay (iOS)
                    'google_pay',     // 🤖 Google Pay (Android)
                    'paypal'          // 💰 PayPal (weltweit beliebt)
                ],
                line_items: [{price:productPrice,quantity:1}],
                success_url: successUrl,
                cancel_url: cancelUrl,
                locale: 'de',
                
            } as any)
            return session
        }catch(error){
            console.log("Error creating checkout session:", error)
            throw error
        }
    }

    async createCustomer({email,supabaseId}:CreateUserProps) {
        try{
            const customer = await this.stripe.customers.create({
                email: email,
                metadata: {supabaseId:supabaseId}
            })
            await this.dataTable.update({
                where:[{column:"user_id" as keyof T, is:supabaseId}],
                update:{stripe_id:customer.id} as Partial<T>
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
        const webhookSecret = this.webhook_key; if (!webhookSecret) throw new Error("No webhook_key")

        let event: Stripe.Event
        try {
            event = this.stripe.webhooks.constructEvent(body, sig as string, webhookSecret)
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`, err)
            return new Response(`Webhook Error: ${err}`, { status: 400 })
        }

        /* diclaimer: der präfix 'c' steht für 'case' und die numer dahinter welcher case, andere variablen namen wären zu lang */
        switch(event.type){
            case "checkout.session.completed":
                try {
                    console.log("Checkout session completed")
                    const c1_session = event.data.object as Stripe.Checkout.Session
                    const c1_user_id = c1_session.client_reference_id
                    if (c1_user_id) {
                        await this.updateUserAbo(c1_user_id, "active")
                    }
                } catch (error) {
                    console.error("Error handling checkout.session.completed:", error)
                }
                break;
                
            case "invoice.paid":
                try {
                    console.log("Invoice paid")
                    const c2_invoice = event.data.object as Stripe.Invoice
                    const c2_customer_id = c2_invoice.customer as string
                    // Für Invoice Events müssen wir die Supabase User ID über die Stripe Customer ID finden
                    const supabaseUserId = await this.getSupabaseUserIdByStripeCustomerId(c2_customer_id)
                    if (supabaseUserId) {
                        await this.updateUserAbo(supabaseUserId, "active")
                    }
                } catch (error) {
                    console.error("Error handling invoice.paid:", error)
                }
                break;
                
            case "invoice.payment_failed":
                try {
                    console.log("Invoice payment failed")
                    const c3_invoice = event.data.object as Stripe.Invoice
                    const c3_customer_id = c3_invoice.customer as string
                    const supabaseUserId = await this.getSupabaseUserIdByStripeCustomerId(c3_customer_id)
                    if (supabaseUserId) {
                        await this.updateUserAbo(supabaseUserId, "past_due")
                    }
                } catch (error) {
                    console.error("Error handling invoice.payment_failed:", error)
                }
                break;
                
            case "customer.subscription.deleted":
                try {
                    console.log("Subscription canceled")
                    const c4_subscription = event.data.object as Stripe.Subscription
                    const c4_customer_id = c4_subscription.customer as string
                    const supabaseUserId = await this.getSupabaseUserIdByStripeCustomerId(c4_customer_id)
                    if (supabaseUserId) {
                        await this.updateUserAbo(supabaseUserId, "canceled")
                    }
                } catch (error) {
                    console.error("Error handling customer.subscription.deleted:", error)
                }
                break;
                }
    }

    async updateUserAbo(userId: string, newStatus: status) {
        try {
            await this.dataTable.update({
                where: [{column: "user_id" as keyof T, is: userId}],
                update: {subscription: {status: newStatus}} as unknown as Partial<T>
            })
            console.log(`✅ User ${userId} subscription status updated to: ${newStatus}`)
        } catch (error) {
            console.error(`❌ Error updating user ${userId} subscription status:`, error)
            throw error
        }
    }

    private async getSupabaseUserIdByStripeCustomerId(stripeCustomerId: string): Promise<string | null> {
        try {
            const users = await this.dataTable.select({
                columns: ["user_id" as keyof T],
                where: [{column: "stripe_id" as keyof T, is: stripeCustomerId}]
            })
            if (users && users.length > 0) {
                return (users[0] as any).user_id as string
            }
            console.warn(`⚠️ No Supabase user found for Stripe customer ID: ${stripeCustomerId}`)
            return null
        } catch (error) {
            console.error("Error finding Supabase user by Stripe customer ID:", error)
            return null
        }
    }
}

// Factory-Funktion die den Type automatisch aus der SupabaseTable ableitet
export function createStripeHandler<T extends StripeSupabase>(config: Omit<StripeProps<T>, 'dataTable'> & { dataTable: SupabaseTable<T> }): StripeHandler<T> {
    return new StripeHandler(config)
}

const stripeHandler = createStripeHandler({ //einfacher simpler dummy
    secret_key:stripeSecretAPIKey,
    webhook_key:stripeWebhookKey,
    dataTable:new SupabaseTable<StripeSupabase>("test")
})

/**
 * eine function die dein produkt/Abo an das korrekte backend schickt und den 
 * user direkt in die stripe-checkout-session schickt
 * @param backend  das backend wohin du dein produkt key schicken willst
 * @param productKey der produktKey, welches ein alias für die price-id ist
 */
export async function handleSession({backend, productKey}: {backend: string, productKey: string}):Promise<void> {
    if (!stripePublicKey) throw new Error("No stripePublicKey in env")
    const stripe = await loadStripe(stripePublicKey)
    if(!stripe) throw new Error("Error loading stripe")
    const respo = await axios.post(backend,{productKey})
    const sessionId = respo.data.id
    const { error } = await (stripe as any)?.redirectToCheckout({ sessionId })
    if (error) throw new Error("Error redirecting to checkout: " + error)
}

/**
 * diese function macht den user zu einem stripe-kunden wenn er noch keiner ist
 * @param table die supabase table wo die stripe-id zum dazugehörigen user gespeichert wird
 * @param backend das backend wohin die user-data geschickt wird um ihn zu einem stripe-kunden zu machen
 * @returns None
 */
export async function addStripeID<T extends StripeSupabase>({table,backend}:{table:SupabaseTable<T>,backend:string}){
    const { data:{ user }, error:getUserError } = await supabase.auth.getUser()
    if(getUserError) throw new Error("Error beim user kriegen in der 'addStripeID' function, Error: " + getUserError)

    const SupabaseUserId = user?.id
    if (!SupabaseUserId) throw new Error("No user ID found")
    
    const stripeID_arr = await table.select({
        columns:["stripe_id" as keyof T],
        where:[{column:"user_id" as keyof T, is:SupabaseUserId}]
    })
    if(stripeID_arr.length > 0){
        console.log(`User:${SupabaseUserId} hat bereits eine stripeID`)
        return
    }
    //So, wenn der code weiter läuft dann ist der user kein stripe-kunde, das fixxen wir jetzt
    const email_arr = await table.select({
        columns:["email" as keyof T],
        where:[{column:"user_id" as keyof T, is:SupabaseUserId}]
    })
    if(email_arr.length === 0) throw new Error("user mit der id: " + SupabaseUserId + " hat keine Mail!")
    
    const email = (email_arr[0] as any).email as string
    if (!email) throw new Error("No email found for user")
    
    const respo = await axios.post(backend,{
        supabaseId:SupabaseUserId,
        email:email
    })
    return respo.data
}

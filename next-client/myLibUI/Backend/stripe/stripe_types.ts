import Stripe from "stripe"

export interface StripeProps {
    products: object,
    stripeInstance?: Stripe
}

export interface CreateCheckoutSessionProps {
    mode: "subscription" | "payment" | "setup",
    successUrl: string,
    cancelUrl: string,
    customerEmail?: string,
    clientReferenceId?: string,
    customerId?: string
}

export interface CreateUserProps {
    email:string,
    supabaseId?:string,
    existingCustomerId?:string
}
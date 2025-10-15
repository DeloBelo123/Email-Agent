import { SupabaseTable } from "../supabase/supabase"

export interface StripeProps<T> {
    products?: object,
    secret_key: string,
    webhook_key: string,
    dataTable: SupabaseTable<T>
}

export interface CreateCheckoutSessionProps {
    mode: "subscription" | "payment" | "setup",
    successUrl: string,
    cancelUrl: string,
    customerEmail?: string,
    clientReferenceId?: string,
    customerId?: string
    products?:object
}

export interface CreateUserProps {
    email:string,
    supabaseId:string,
}

export interface Subscription {
    priceId:string,
    status:status,
    startDate:string,
    endDate:string
}

export interface StripeSupabase {
    user_id:string, // supabase user id
    email:string,
    stripe_id:string | null,
    subscription:Subscription
}

export type tier = "starter" | "advanced" | "premium"
export type status = "active" | "canceled" | "past_due"
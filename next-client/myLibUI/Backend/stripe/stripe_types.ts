import { SupabaseTable } from "../supabase/supabase"

export interface StripeProps<T> {
    products?: object,
    secret_key: string,
    public_key: string,
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
    supabaseId?:string,
    existingCustomerId?:string
}
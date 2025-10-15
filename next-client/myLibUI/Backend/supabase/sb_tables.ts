import { UUID } from "crypto"
import { SupabaseTable } from "./supabase"
import { Tier } from "../stripe/stripe_types"

export interface MailTable {
    unique_mail_id:string
    inhaber_id:string
    mail_header:string
    mail_body:string
    mail_summary:string
    mail_category:string
    created_at:string
}
export const mailTabelle = new SupabaseTable<MailTable>("mails")

export interface UserTable {
    user_id:UUID
    mail_inhaber_id:UUID
    user_mail:string 
    Abo:Tier
    OnOff: "on" | "off"
}
export const userTabelle = new SupabaseTable<UserTable>("users")



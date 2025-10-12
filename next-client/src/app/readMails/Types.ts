export interface Email {
    unique_mail_id:string
    inhaber_id:string,
    mail_header:string,
    mail_body:string,
    mail_summary:string,
    mail_category:string,
    created_at:string
} 

export type Output = {
  neue_interessenten: Email[];
  bestehende_kunden: Email[];
  eigentuemer_verkaufsinteressenten: Email[];
  behoerdliche_rechtliche_themen: Email[];
  marketing_kooperationen: Email[];
  spam_unwichtiges: Email[];
};

export type PythonResponse = {
    status:number
    emails:any
}

export const mailCategories = {
    neue_interessenten:"",
    bestehende_kunden:"",
    eigentuemer_verkaufsinteressenten:"",
    behoerdliche_rechtliche_themen:"",
    marketing_kooperationen:"",
    spam_unwichtiges:"",
} as const

export type MailCategories = keyof typeof mailCategories
export type AllCategories = MailCategories | "OverView"
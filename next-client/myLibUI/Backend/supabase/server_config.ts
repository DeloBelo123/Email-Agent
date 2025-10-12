import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers";
import axios from "axios";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!

export  async function getServerSupabase(){ // wenn man supabase auf dem server nutzen will gibt es sowas ja nicht, deswegen muss man die cookies durch diese next.js function bekommen die nur die aktuellen cookies holt, deswegen muss man eine function erstellen die pro aufruf 'await cookies()' wirft damit man immer die aktuellen cookies hat
    return createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {cookies: await cookies()})
} 

export async function sendSessionfromServer({toBackend}:{toBackend:string}){
    const client = await getServerSupabase()
    const { data, error:sessionError } = await client.auth.getSession()
    if (sessionError) throw new Error("fehler beim session Kriegen!")
    try{
        const { data:backendData,status } = await axios.post(
            toBackend,
            {
                google_access_token:data.session?.provider_token,
                google_refresh_token:data.session?.provider_refresh_token,
                user:{
                    id:data.session?.user.id,
                    email:data.session?.user.email
                }
            }
        )
        return { data:backendData,status,session:data.session }
    }catch(e){
        console.error(`Error bei 'sendSession' call: ${e}`)
        return { data:null, status:500 }
    }
}
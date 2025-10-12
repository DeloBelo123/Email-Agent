
"use client"
import { supabase,OAuthLogin } from "./supabase/supabase"
import BaseProps from "../BaseProps"
import IconClamp from "../Clamps/IconClamp"
import Button from "../Components/Button"
import { User } from "lucide-react"

interface AuthProps extends BaseProps {
    btn?:boolean,
    userIcon?:boolean
    textClass?:string
    iconBorder?:string
    scopes?:Array<string> | undefined
    backendURL?:string
    redirectTo:string
}
/**
 * du musst sagen ob du das in form eines buttons haben willst oder als user-icon
 * utility-props:
 * @param scopes - die scopes für die Google-Auth, also was für zugriffe du so alles bekommen kannst an die daten des users (inbox, profil, docs, etc)
 * @param redirectTo - die page zu der der user nach dem login weitergeleitet wird
 * @returns eine komponente für Google-Auth, entweder als button oder als user-icon
 */
export default function GoogleAuth({
    className,
    btn=false,
    size="large",
    userIcon=true,
    iconBorder,
    icon = <User className={`w-full h-full cursor-pointer ${className}`}/>,
    scopes=undefined,
    redirectTo,
    children="Google Authentication",
}:AuthProps) {
    if(btn){
        userIcon = false
    }
    if(btn && userIcon){
        throw new Error("du kannst nicht button und userIcon gleichzeitig wollen, entscheide dich!")
    }
    
  return(
    <>
        {
            btn ?

            <Button onClick={async ()=> await OAuthLogin({scopes:scopes,redirectTo:redirectTo})} size={size} className={`${className}`}>
                {children}
            </Button>
            
              : 

            userIcon ? 

            <IconClamp className={`border rounded-full transition-all hover:scale-105 active:scale-98 ${iconBorder}`} onClick={async ()=> await OAuthLogin({scopes:scopes,redirectTo:redirectTo})} size={size}>
                {icon}
            </IconClamp>

            :

            null
        }
    </>
  )
}

//Version 3
/*
"use client"
import { supabase } from "./supabase/supabase"
import BaseProps from "../BaseProps"
import IconClamp from "../Clamps/IconClamp"
import Button from "../Components/Button"
import { User } from "lucide-react"
import { useRouter } from "next/navigation" 
import axios from "axios"

interface AuthProps extends BaseProps {
    btn?:boolean,
    userIcon?:boolean
    textClass?:string
    iconBorder?:string
    scopes?:string | undefined
    backendURL?:string
    redirectTo?:string
}
/**
 * du musst sagen ob du das in form eines buttons haben willst oder als user-icon
 * utility-props:
 * @param scopes - die scopes für die Google-Auth, also was für zugriffe du so alles bekommen kannst an die daten des users (inbox, profil, docs, etc)
 * @param backendURL - die Backend-URL der du die session tokens des users schickst 
 * @param redirectTo - die page zu der der user nach dem login weitergeleitet wird
 * @returns eine komponente für Google-Auth, entweder als button oder als user-icon
 *
export default function GoogleAuth({
    className,
    btn=false,
    size="large",
    userIcon=true,
    iconBorder,
    icon = <User className={`w-full h-full cursor-pointer ${className}`}/>,
    scopes=undefined,
    backendURL,
    redirectTo,
    children="Google Authentication",
}:AuthProps) {
    const router = useRouter()
    async function handleLogin(){
        try{
            const { error:SignInError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    scopes:scopes,
                }})  
            if (SignInError) throw new Error("fehler beim OAuth-Sign in!")     
            const { data, error } = await supabase.auth.getSession(); if (error) throw new Error("fehler beim Session kriegen!")
            console.log(`Provider token der session: ${data.session?.provider_token}`)
            console.log(`refresh token der session: ${data.session?.provider_refresh_token}`)
            console.log(`user token der session: ${data.session?.user}`)
            if(!data.session?.provider_token){
                throw new Error("Es gibt keinen provider token bei session!")
            }
            if(backendURL){
                try{
                    const { status } = await axios.post(
                    backendURL,
                    {
                        google_access_token:data.session?.provider_token,
                        google_refresh_token:data.session?.provider_refresh_token,
                        user:{id:data.session?.user.id, email:data.session?.user.email}
                    }
                )
                    console.log(`Yaaaay erfolgreich es kam gut beim backend an!: ${status}`)
                }catch(e){
                    console.log(`scheiseeeee, kam nicht gut beim backend an: ${e}`)
                }
            }
            if(redirectTo){
                router.push(redirectTo)
            }
        }catch(e){
            console.error("Error: " + e )
        }
    }
  return(
    <>
        {
            btn ?

            <Button onClick={handleLogin} size={size} className={`${className}`}>
                {children}
            </Button>
            
              : 

            userIcon ? 

            <IconClamp className={`border rounded-full transition-all hover:scale-105 active:scale-98 ${iconBorder}`} onClick={handleLogin} size={size}>
                {icon}
            </IconClamp>

            :

            null
        }
    </>
  )
}
*/

//version 2
/*
    "use client"
import { useEffect, useState } from "react"
import { supabase } from "./supabase/supabase"
import BaseProps from "../BaseProps"
import IconClamp from "../Clamps/IconClamp"
import Button from "../Components/Button"
import { User } from "lucide-react"
import { Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation" 
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

interface AuthProps extends BaseProps {
    btn?:boolean,
    userIcon?:boolean
    textClass?:string
    iconBorder?:string
    scopes?:string | undefined
    backendURL?:string
    redirectTo?:string
}
/**
 * du musst sagen ob du das in form eines buttons haben willst oder als user-icon
 * utility-props:
 * @param scopes - die scopes für die Google-Auth, also was für zugriffe du so alles bekommen kannst an die daten des users (inbox, profil, docs, etc)
 * @param backendURL - die Backend-URL der du die session tokens des users schickst 
 * @param redirectTo - die page zu der der user nach dem login weitergeleitet wird
 * @returns eine komponente für Google-Auth, entweder als button oder als user-icon
 *
export default function GoogleAuth({
    className,
    btn=false,
    size="large",
    userIcon=true,
    iconBorder,
    icon = <User className={`w-full h-full cursor-pointer ${className}`}/>,
    scopes=undefined,
    backendURL,
    redirectTo,
    children="Google Authentication",
}:AuthProps) {
    const [sessionState,setSessionState] = useState<Session | null>(null)
    const [canSend,setCanSend] = useState<boolean>(false)
    const [wasSend,setWasSend] = useState<boolean>(false)
    const router = useRouter()

    const { error } = useQuery({
        queryKey: ["session"],
        queryFn:async()=>{
            if(backendURL){
                const { status } = await axios.post(
                    backendURL,
                    {
                        google_refresh_token:sessionState?.provider_refresh_token,
                        google_access_token:sessionState?.provider_token,
                        user:{id:sessionState?.user.id, email:sessionState?.user.email}
                    }
                )
                return status
            }
        },
        enabled:canSend, //sagt ab wann er den fetch auslöst
        staleTime: Infinity //sagt wie lange die daten als "frisch" gelten damit ein refetch statt finden kann wenn die nicht mehr frisch sind, hier sage ich infinity weil ich nicht will das das hier refetcht wird
    })

    if(error) throw new Error("lieber Delo, du hast wieder einen error beim abschicken der daten... diesmal mit useQuery!")
        
    async function handleLogin(){
        try{
            const { error:SignInError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    scopes:scopes,
                }})   
            if (!SignInError && redirectTo) setTimeout(()=>{router.push(redirectTo)},500)
            if (SignInError) console.error("fehler beim Google-login!" + SignInError)    
        }catch(e){
            console.error("Error: " + e )
        }
    }
        useEffect(()=>{
            const { data:listener } = supabase.auth.onAuthStateChange((event,session)=>{
                console.log(`[AUTH EVENT] ${new Date().toISOString()} event=${event} provider_token=${session?.provider_token} provider_refresh=${session?.provider_refresh_token}`)
                if(!wasSend){
                    if (event === "SIGNED_IN" && session?.provider_token){
                        setSessionState(session)
                        setCanSend(true)
                        setWasSend(true)
                    }
                }
            })
            return () => {
                listener.subscription.unsubscribe()
            }
        },[])
  return(
    <>
        {
            btn ?

            <Button onClick={handleLogin} size={size} className={`${className}`}>
                {children}
            </Button>
            
              : 

            userIcon ? 

            <IconClamp className={`border rounded-full transition-all hover:scale-105 active:scale-98 ${iconBorder}`} onClick={handleLogin} size={size}>
                {icon}
            </IconClamp>

            :

            null
        }
    </>
  )
}
*/


// version 1
/*

"use client"
import { useEffect, useRef, useState } from "react"
import { supabase } from "./supabase/supabase"
import BaseProps from "../BaseProps"
import IconClamp from "../Clamps/IconClamp"
import Button from "../Components/Button"
import { User } from "lucide-react"
import { Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation" 

interface AuthProps extends BaseProps {
    btn?:boolean,
    userIcon?:boolean
    textClass?:string
    iconBorder?:string
    scopes?:string | undefined
    backendURL?:URL | RequestInfo
    redirectTo?:string
}
/**
 * du musst sagen ob du das in form eines buttons haben willst oder als user-icon
 * utility-props:
 * @param scopes - die scopes für die Google-Auth, also was für zugriffe du so alles bekommen kannst an die daten des users (inbox, profil, docs, etc)
 * @param backendURL - die Backend-URL der du die session tokens des users schickst 
 * @param redirectTo - die page zu der der user nach dem login weitergeleitet wird
 * @returns eine komponente für Google-Auth, entweder als button oder als user-icon
 *
export default function GoogleAuth({
    className,
    btn=false,
    size="large",
    userIcon=true,
    iconBorder,
    icon = <User className={`w-full h-full cursor-pointer ${className}`}/>,
    scopes=undefined,
    backendURL,
    redirectTo,
    children="Google Authentication",
}:AuthProps) {
    const [sessionState,setSessionState] = useState<Session | null>(null)
    const lastSentTokenRef = useRef<string | null | undefined>(null) // checkt ob wir schon token haben
    const sendingRef = useRef(false) //checkt ob grade ein token geschickt wird
    const router = useRouter()
    async function handleLogin(){
        try{
            const { error:SignInError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    scopes:scopes,
                }})   
                console.log("bin bei function handle-logging, hab jetzt per oauth eingesigned!") 
            if (!SignInError && redirectTo){
                setTimeout(()=>{
                    router.push(redirectTo)
                },500)
            }
            if (SignInError){
                console.error("fehler beim Google-login!" + SignInError)
                return;
            }
        }catch(e){
            console.error("Error: " + e )
            return;
        }
    }
        useEffect(()=>{
            const { data:listener } = supabase.auth.onAuthStateChange((event,session)=>{
                console.log(`[AUTH EVENT] ${new Date().toISOString()} event=${event} provider_token=${session?.provider_token} provider_refresh=${session?.provider_refresh_token}`)
                if (event === "SIGNED_IN"){
                    setSessionState(session)
                }
            })
            return () => {
                listener.subscription.unsubscribe()
            }
        },[])

        useEffect(()=>{
            //mache hier meine check-ups
            if(!sessionState){
                console.log("keine Session state grade!")
                return;
            }

            if(sendingRef.current || lastSentTokenRef.current){
                console.log("wir haben schon einen token geschickt oder er wird grade geschickt!")
                return;
            }

            sendingRef.current = true

            async function session_n_token_check(){
                //holle hier die session
                const { data, error:SessionError } = await supabase.auth.getSession()
                if(SessionError){
                    throw new Error("fehler beim Session-kriegen!" + SessionError)
                }

                //holle und logge die session props
                const supabaseSession = data.session
                console.log(`die supabase-session: ${supabaseSession} hat den type: ${typeof(supabaseSession)}`)

                const user_id = supabaseSession?.user.id
                const user_email = supabaseSession?.user.email
                const user_data = {id:user_id,email:user_email}

                const googleAccessToken = supabaseSession?.provider_token
                console.log(`der google access token: ${googleAccessToken} hat den type: ${typeof(googleAccessToken)}`)

                const googleRefrefreshToken = supabaseSession?.provider_refresh_token 
                console.log(`der google refresh token: ${googleRefrefreshToken} hat den type: ${typeof(googleRefrefreshToken)}`)

                if(!supabaseSession) {
                    console.log("keine Supabase-Session nach dem ich versucht habe die session zu holen amk!")
                    return;
                }
                 if (supabaseSession?.provider_token && backendURL){
                    try{
                        const response = await fetch(backendURL,{
                        method: "POST", 
                        headers: {"Content-Type":"application/json"},
                        body: JSON.stringify({
                            google_access_token: googleAccessToken,
                            user: user_data,
                            google_refresh_token: googleRefrefreshToken, 
                        })
                    })
                        if (response.ok){
                            console.log("yaaaay, mein backend hat die tokens bekommen!!!" + response.status)

                            lastSentTokenRef.current = googleAccessToken
                            console.log(`der lastSentTokenRef: ${lastSentTokenRef} hat den type: ${typeof(lastSentTokenRef.current)}`)
                        }else{
                            throw new Error("oh nein, mein backend hat die token nicht bekommen ey, scheissseeeee "+ response.status)
                        }
                    }catch(e){
                        console.error("Error: " + e)
                    }finally{
                        sendingRef.current = false
                    }
                }
            }
            session_n_token_check()
        },[sessionState])
  return(
    <>
        {
            btn ?

            <Button onClick={handleLogin} size={size} className={`${className}`}>
                {children}
            </Button>
            
              : 

            userIcon ? 

            <IconClamp className={`border rounded-full transition-all hover:scale-105 active:scale-98 ${iconBorder}`} onClick={handleLogin} size={size}>
                {icon}
            </IconClamp>

            :

            null
        }
    </>
  )
}
*/


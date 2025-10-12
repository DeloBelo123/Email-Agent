"use client"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { sendSession } from "../Backend/supabase/supabase"
import axios from "axios"
import { useEffect } from "react"
interface CallStackType{
    sendToAI:string
    getFromRoute:string
    queryKey:Array<any>
}
type Generics<T,K>= {
    AIRespo:T
    DBRespo:K
}
export default function useCallStack<G extends Generics<any,any>>({sendToAI,getFromRoute,queryKey}:CallStackType){
    const { data:AIData, error:AIError, mutate } = useMutation({
        mutationFn: async() => {
            return await sendSession<G["AIRespo"]>({
                toBackend:sendToAI
            })
        },
        onSuccess:(result) => {
            console.log("Backend hat geantwortet", result.data)
            console.log("Status:", result.status)
            console.log("Session Info:", result.session)
        }
    })
    useEffect(() => {
        mutate()
    },[])
    const { data:DBData, error:DBError } = useQuery({
        queryKey:queryKey,
        queryFn: async() => {
            const data = await axios.get<G["DBRespo"]>(getFromRoute)
            return data.data
        }
    })
    if(AIError) throw new Error(`AI Backend Error: ${AIError}`);
    if(DBError) throw new Error(`DB Backend Error: ${DBError}`);
    return {
        AIData:AIData,
        DBData:DBData
    }
}

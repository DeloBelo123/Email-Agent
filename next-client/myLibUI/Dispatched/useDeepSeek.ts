"use client"
//@ts-ignore
import { fetching } from "./useFetch";
import { useEffect, useState } from "react"
interface DeepSeeKProps extends Partial<fetching> {
    apiKey: string;
    model?: string;
    maxTokens?: number;
    content:string
}
export default function useDeepSeek<T = any>({apiKey,model="deepseek-chat",maxTokens=1000,content}:DeepSeeKProps){
    const [data,setData] = useState<T>()
    const [error,setError] = useState<unknown>(null)    
    const [loading,setLoading] = useState<boolean | undefined>(undefined)
    async function fetchDeepSeek(){
        setLoading(true)
        try{
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                  model: model,
                  messages: [
                    { role: "system", content: "Du bist ein hilfreicher Assistent." },
                    { role: "user", content: content }
                  ],
                  max_tokens: maxTokens
                })
              })
              if(!response.ok){
                  throw new Error(`DeepSeek Fehler beim aufruf der daten!: ${response.statusText}`)
              }
              const result = await response.json()
              setData(result)
        }catch(error){
            console.error(error);
            setError(error);
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchDeepSeek()
    },[apiKey,model,maxTokens,content])
    return {data,error,loading,refetch:fetchDeepSeek}
}
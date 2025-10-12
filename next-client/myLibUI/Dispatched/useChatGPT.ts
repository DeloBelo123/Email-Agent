"use client"
//@ts-ignore
import { fetching } from "./useFetch"
import { useEffect, useState } from "react"
interface OpenAIProps extends Partial<fetching> {
    apiKey: string;
    model?: string;
    temperature?: number;
    content:string
}
export default function useChatGPT<T = any>({apiKey,model="gpt-4",temperature=0.4,content}:OpenAIProps){
    const [data,setData] = useState<T>()
    const [error,setError] = useState<unknown>(null)    
    const [loading,setLoading] = useState<boolean | undefined>(undefined)
    async function fetchOpenAI(){
        setLoading(true)
        try{
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
                  temperature: temperature
                })
              })
              if(!response.ok){
                  throw new Error(`OpenAI-fehler beim aufruf der daten!: ${response.statusText}`)
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
        fetchOpenAI()
    },[apiKey,model,temperature,content])
    return {data,error,loading,refetch:fetchOpenAI}
}
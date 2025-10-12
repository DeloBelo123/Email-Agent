"use client"
//tod
import { useEffect, useState } from "react"
export interface fetching{
    url:string
    method?: "GET" | "POST" | "PUT" | "DELETE"
    body?:object
    header?: HeadersInit
}
export default function useFetch<T = any>({url,method="GET",body,header}:fetching){
    const [data,setData] = useState<T>()
    const [error,setError] = useState<unknown>()
    const [loading,setLoading] = useState<boolean | undefined>(undefined)
    async function fetchData(){
        setLoading(true)
        try{
            const rohData = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    ...header
                },
                body: body ? JSON.stringify(body) : undefined
            })
            if (!rohData.ok) {
                throw new Error(`Ohoh fehler! Hilfeeee! status: ${rohData.status}`);
            }
            const jsonData = await rohData.json();
            setData(jsonData);
        }catch(error){
            console.error("Fetch error:", error);
            setError(error);
        }finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        fetchData()
    },[url,method,body])
    return{error,data,loading,refetch:fetchData}
}

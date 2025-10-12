"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

const queryClient = useQueryClient()
const data = queryClient.getQueryData(["user"]) //hat jetzt die daten im cache vom key user in der map

type User = {
    name:string
    id:number
}
export function Testos({userID}:{userID:number}){
    const { data, error, isLoading, refetch } = useQuery<User>({
        queryKey:["User",userID],
        queryFn:async()=>{
            const { data } = await axios.get<User>(`User/${userID}`)
            return data
        }
    })
    if (error) return <div> Fehler beim fetchen...</div>
    if (isLoading) return <div> ladet noch...</div>
    return(
        <>
            <p>{data?.name}</p>
            <button onClick={()=>{refetch()}}>neuladen</button>

        </>
    )
}

type Response = {
    status:number
    response:string
}
export function ZweiterTest({}){
    const { data, error, isLoading , refetch } = useQuery<Response>({
        queryKey:["response"],
        queryFn:async()=>{
            const { data } = await axios.post<Response>(
                "spassURL",
                {data:"hi wie geht es dir"}
            )
            return data
        }
    })
    return(
        <>

        </>
    )
}

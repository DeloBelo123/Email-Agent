"use client"

/* mach zur komponente aber so richtig schlau man! */
import { fetching } from "../Dispatched/useFetch"
import useFetch from "../Dispatched/useFetch"
interface PicProps extends Partial<fetching> {
    query?:string
    apiKey?:string
}
export default function usePic({url,query,apiKey}:PicProps){
    const head = apiKey ? { Authorization : apiKey} : undefined
    //oh my days, useFetch ist veraltet, überarbeite das später mit useQuery!
    const picture = useFetch({
        url: url || `https://api.unsplash.com/search/photos?query=${query}`,
        header: head
    })
    return picture
}
"use client"
import { clamp } from "./Clamp"
import { Animation,normal } from "../Animations"
import Div from "./Div"
export interface ClamperType {
    children?:React.ReactNode
    className?:string
    min?:string | undefined
    pref?:string | undefined
    max?:string | undefined
    variants?:Animation
    initial?:string
    animate?:string
}

export default function Clamper(
    {children,
    className,
    min="100px",
    pref="100vw",
    max="100vw",
    variants=normal,
    initial="hidden",
    animate="visible"
   }
    :ClamperType){
    return(
        <>
            <Div
            variants={variants}
             initial={initial}
              animate={animate}
               className={className}
                style={{width:clamp(`${min}`,`${pref}`,`${max}`)}} >
                {children}
            </Div>
        </>
    )
}
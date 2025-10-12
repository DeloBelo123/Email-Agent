"use client"
import { ClamperType } from "./Clamper"
import { motion } from "framer-motion"
import { clamp } from "./Clamp"
import { Animation,normal } from "../Animations"

export interface textClamp extends ClamperType  {
    variant?:Animation
    initial?:string
    animate?:string
    size?: "xs" | "small" | "mid" | "large" | "xl"
}

export default function TextClamp(
    {children,
    className,
    size="mid",min,pref,max,
    variant=normal, 
    initial="hidden",
    animate="visible"
   }
    :textClamp){

    const fontSizes = {
        xs:    { min: "10px", pref: "1.3vw", max: "14px" },
        small: { min: "14px", pref: "1.6vw", max: "18px" },
        mid:   { min: "16px", pref: "2.2vw", max: "24px" },
        large: { min: "24px", pref: "3.5vw", max: "40px" },
        xl:    { min: "40px", pref: "5vw",   max: "72px" }
     }
   
    const selectedFontSize = fontSizes[size]

    const finalMin = min || selectedFontSize.min
    const finalPref = pref || selectedFontSize.pref
    const finalMax = max || selectedFontSize.max

    return(
        <>
            <motion.p
             variants={variant}
             initial={initial}
             animate={animate}
             className={className}
             style={{fontSize:clamp(`${finalMin}`,`${finalPref}`,`${finalMax}`)}}>
                {children}
            </motion.p>
        </>
    )
}

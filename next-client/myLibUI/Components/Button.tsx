"use client"
import { clamp } from "../Clamps/Clamp"
import { motion } from "framer-motion"
import { normal } from "../Animations"
import BaseProps from "../BaseProps"
export default function Button(
    {children,
    className,
    dark=false,
    variants=normal,
    initial="hidden",
    animate="visible",
    min,paMin="20px",
    pref,paPref="1.5vw",
    max,paMax="30px",
    size="mid",
    onClick
   }:BaseProps){
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
        <motion.button
         onClick={onClick}
         className={`p-1 rounded-lg px-5 transition-all hover:scale-102 active:scale-98 border h-fit  ${ dark ? " bg-gray-800 text-gray-200":" "} ${className} `}
         variants={variants}
         initial={initial}
         animate={animate}
         style={{fontSize:clamp(`${finalMin}`,`${finalPref}`,`${finalMax}`),
                 paddingInline:clamp(`${paMin}`,`${paPref}`,`${paMax}`)}} >
            {children}
        </motion.button>
    )
}
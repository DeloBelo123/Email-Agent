"use client"
import { motion } from "framer-motion"
import { clamp } from "./Clamp"
import { normal } from "../Animations"
import { textClamp } from "./TextClamp"
export interface imgClamp extends textClamp{
    src?:string
    aspectRatio?:string
}
export default function ImgClamp(
    {className,
    min,pref,max,src,
    variant=normal,
    initial="hidden",
    animate="visible",
    size="mid"
   }
    :imgClamp){
    const picSizes = {
        xs:    { min: "32px",  pref: "6vw",  max: "64px" },    
        small: { min: "64px",  pref: "10vw", max: "128px" },   
        mid:   { min: "128px", pref: "20vw", max: "256px" },   
        large: { min: "256px", pref: "35vw", max: "512px" },  
        xl:    { min: "512px", pref: "60vw", max: "1024px" },  
    }
    const selectedPicSize = picSizes[size]
    
    const finalMin = min || selectedPicSize.min
    const finalPref = pref || selectedPicSize.pref
    const finalMax = max || selectedPicSize.max
    return(
        <>
            <motion.img
             variants={variant}
             initial={initial}
             animate={animate}
             className={` ${className}`}
             src={src}
             style={{width: clamp(`${finalMin}`,`${finalPref}`,`${finalMax}`)}}/>
                
        </>
    )
}
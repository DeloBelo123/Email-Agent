"use client"

/* wichtig: wenn du den iconClamp nutzt, musst du dein icon auch auf w-full und h-full stellen
damit dein icon die grösse des divs einnimmt! */

import { motion } from "framer-motion"
import { clamp } from "./Clamp"
import { normal } from "../Animations"
import { textClamp } from "./TextClamp"
import BaseProps from "../BaseProps"

interface iconClamp extends BaseProps{

}

export default function IconClamp(
    {children,
    className,
    size="mid",min,pref,max,
    variants=normal, 
    initial="hidden",
    animate="visible",
    onClick
   }
    :iconClamp){
    const iconSizes = {
        xs:    { min: "10px", pref: "1.3vw", max: "14px" },
        small: { min: "14px", pref: "1.6vw", max: "18px" },
        mid:   { min: "16px", pref: "2.2vw", max: "24px" },
        large: { min: "24px", pref: "3.5vw", max: "40px" },
        xl:    { min: "40px", pref: "5vw",   max: "72px" }
    }
    const selectedIconSize = iconSizes[size]

    const finalMin = min || selectedIconSize.min
    const finalPref = pref || selectedIconSize.pref
    const finalMax = max || selectedIconSize.max

    console.warn("vergiss nicht bei deinem icon w-full und h-full ins classname zu setzten")

    return(
        <>
            <motion.div
             onClick={onClick}
             variants={variants}
             initial={initial}
             animate={animate}
             className={className}
             style={{width:clamp(`${finalMin}`,`${finalPref}`,`${finalMax}`)}}>
                {children}
            </motion.div>
        </>
    )
}
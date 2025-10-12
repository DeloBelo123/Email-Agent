"use client"

/* kleiner Sub-Text unter Bigtext meist, erläutert den BigText weiter */

import { motion } from "framer-motion"
import BaseProps from "../../BaseProps"
import { spawningKinder } from "../../Animations"
import TextClamp from "../../Clamps/TextClamp"

export default function SmallText(
    {min="14px",pref="2vw",max="24px",
    children,className,
    variants=spawningKinder,
    initial,animate,}
    :BaseProps){
    return(
        <motion.div variants={variants} initial={initial} animate={animate}>
            <TextClamp className={` text-pretty ${className}`} min={min} pref={pref} max={max} >
                {children}
            </TextClamp>
        </motion.div>
    )
}
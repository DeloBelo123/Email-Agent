"use client"

/* entweder der call to action Teil oder allgemein alles aufmerksamkeit
deiner webiste bringen soll */

import BaseProps from "../../BaseProps"
import { motion } from "framer-motion"
import TextClamp from "../../Clamps/TextClamp"
import { spawningKinder } from "../../Animations"
export default function BigText(
    {children,
     variants=spawningKinder,
     initial,animate,className,
     textClass,min="30px",
     max="300px",pref="5vw"
    }:BaseProps){
    return(
        <motion.div className={className} variants={variants} initial={initial} animate={animate}>
            <TextClamp min={min} pref={pref} max={max} className={` text-pretty ${textClass}`}>
                {children}
            </TextClamp>
        </motion.div>
    )
}
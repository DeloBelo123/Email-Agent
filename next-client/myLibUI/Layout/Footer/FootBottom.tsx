"use client"

/* der hier kommt ganz unten beim footer, ist gedacht um nur diesen basic Text zu beeinhalten
mit copyright und so */

//WICHTIG: <span> orientiert, weil viel unter <TextClamp> geklammert ist

import { motion } from "framer-motion"
import { spawningKinder } from "../../Animations"
import BaseProps from "../../BaseProps"
import TextClamp from "../../Clamps/TextClamp"
export default function FootBottom({
    variants=spawningKinder,
    initial,animate,
    className,children,
    min,pref,max,size="small"
}:BaseProps){
    return(
       <motion.div
         variants={variants} initial={initial} animate={animate}>
            <TextClamp
            size={size}
             min={min} pref={pref} max={max}
              className={` text-pretty text-gray-400 ${className}`}>
                {children}
            </TextClamp>
       </motion.div>
    )
}
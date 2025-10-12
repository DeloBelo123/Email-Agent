"use client"

/* diese Komponente beeinhaltet einfach ein Text, sei es der name der marke
oder ein slogan, mit einem icon daneben, kommt ganz oben beim footer */

//WICHTIG: <span> orientiert, weil viel unter <TextClamp> geklammert ist

import React from "react"
import { motion } from "framer-motion"
import BaseProps from "../../BaseProps"
import { spawningKinder } from "../../Animations"
import TextClamp from "../../Clamps/TextClamp"
export default function FootTop({
    variants=spawningKinder,
    initial,animate,
    className,children,
    icon,min,pref,max,size="xl"
}:BaseProps){
    if (React.isValidElement(children) && children.type !== 'span' || typeof children === 'string') {
        console.error("fehler, children muss entweder ein <span> </span> sein, oder einfach Text")
      }  
    return(
        <motion.div
         className={` flex gap-2 ${className}`}
         variants={variants} initial={initial} animate={animate}>
                {icon}
            <TextClamp
             className={` text-pretty text-gray-400 `}
              size={size}
               min={min} pref={pref} max={max}>
                {children}
            </TextClamp>
        </motion.div>
    )
}
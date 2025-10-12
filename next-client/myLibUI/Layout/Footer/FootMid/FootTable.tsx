"use client"

/* das hier ist der content der mid-section des Footers, war eigentlich gedacht das 
man tabellen artig unter dem titel einfach nur Links eingibt zum thema, sowas wie 
"sozial media" und dann kommen da links, und dann die nächste tabelle halt */

//WICHTIG: <span> orientiert, weil viel unter <TextClamp> geklammert ist

import { motion } from "framer-motion"
import React from "react"
import BaseProps from "../../../BaseProps"
import { spawningKinder,innerSpawningPapa } from "../../../Animations"
import TextClamp from "../../../Clamps/TextClamp"
export default function FootTable({
    variants=spawningKinder,title,
    initial,animate,titleClass,
    className,children,
    papavariants=innerSpawningPapa,
    min,pref,max,size="xs"
}:BaseProps){
    let childrenArr = React.Children.toArray(children)
    return(
        <motion.div
         className=" flex flex-col gap-1 p-1"
          variants={papavariants} initial={initial} animate={animate}>
                <TextClamp
                 className={`${titleClass} text-pretty text-gray-400`}>
                    {title}
                </TextClamp>
            <motion.div>
                {childrenArr.map((item,index)=>{
                     if (React.isValidElement(children) && children.type !== 'span' || typeof children === 'string') {
                        console.error("fehler, children muss entweder ein <span> </span> sein, oder einfach Text")
                      } 
                    return(
                        <motion.div 
                        key={index} className={` text-gray-600 transition-all hover:text-gray-400 ${className}`}
                        variants={variants} initial={initial} animate={animate}>
                            <TextClamp 
                             min={min} pref={pref} max={max}
                             size={size}>
                                {item}
                            </TextClamp>
                        </motion.div>
                    )})}
            </motion.div>
        </motion.div>
    )
}
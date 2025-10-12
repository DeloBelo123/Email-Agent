"use client"
import React, { useState } from "react"
import BaseProps from "../BaseProps"
import { motion } from "framer-motion"
import { spawningKinder } from "../Animations"
import { useContext } from "react"
import { HoverContext } from "./Sidebar"
import TextClamp from "../Clamps/TextClamp"
import IconClamp from "../Clamps/IconClamp"
export default function Sideitem({
    children,
    variants=spawningKinder,
    initial,animate,className,
    icon,size="mid",
    iconSize
}:BaseProps){
    const hoverbar = useContext(HoverContext)
     if (!((React.isValidElement(children) && children.type === 'span') || typeof children === 'string')) {
        console.error("fehler, children muss entweder ein <span> </span> sein, oder einfach Text")
    } 
    const zustand = hoverbar ? " transition-all duration-300 group-hover:duration-500 max-w-0 group-hover:max-w-40 overflow-hidden" : "max-w-full"
    return(
        <motion.div
         variants={variants} initial={initial} animate={animate}
          className={` transition-all hover:scale-102 active:scale-98 items-center ${className} flex gap-1 `}>
            <div>
                <IconClamp size={iconSize ? iconSize:size}>
                    {icon}
                </IconClamp>
            </div>
            <div className={` ${zustand}`}>
                <TextClamp size={size}>
                 {children}
                </TextClamp>
            </div>
        </motion.div>
    )
}
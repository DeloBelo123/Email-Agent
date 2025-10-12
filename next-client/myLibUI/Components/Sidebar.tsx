"use client"

//Überarbeite das später noch so, das ab einer bestimmten Breite die Sidebar nicht mehr angezeigt wird,
//  sondern nur noch ein Button der die Sidebar öffnet.

import BaseProps from "../BaseProps"
import { motion } from "framer-motion"
import { papa } from "../Animations"
import { createContext } from "react"
interface Sidebar extends BaseProps {
    hoverbar?:boolean
}
export const HoverContext = createContext<boolean | undefined>(undefined)
export default function Sidebar({
    variants=papa,
    initial="hidden",
    animate="visible",
    className,children,
    hoverbar=false
}:Sidebar){
    console.warn("falls du hoverbar true setzt, musst du selber noch mal 'group' in classname setzten")
    return(
       <HoverContext.Provider value={hoverbar}>
         <motion.div
        variants={variants} initial={initial} animate={animate}
         className={` ${hoverbar ? " group overflow-hidden " : "" } border w-fit z-10 items-center p-1 pr-3 flex flex-col gap-2 h-screen sticky top-0 justify-self-start ${className}`}>
            {children}
        </motion.div>
       </HoverContext.Provider>
    )
}
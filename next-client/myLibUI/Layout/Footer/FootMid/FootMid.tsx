"use client"

/* hier befinden sich dann die Foottabelles in einer Reihe */

import React from "react"
import BaseProps from "../../../BaseProps"
import { motion } from "framer-motion"
import { innerSpawningPapa } from "../../../Animations"
export default function FootMid({
    variants=innerSpawningPapa,
    initial,animate,
    className,children
}:BaseProps){
    return(
       <motion.div
        className={` flex gap-1 p-1 ${className}`}
         variants={variants} initial={initial} animate={animate}>
            {children}
       </motion.div>
    )
}
"use client"

/* hier versammeln sich die Hero komponenten */

import BaseProps from "../../BaseProps"
import { motion } from "framer-motion"
import { papa } from "../../Animations"
export default function MyHero({
    variants=papa,
    initial="hidden",
    animate="visible",
    className,children
}:BaseProps){
    return(
        <motion.div
         className={` flex flex-col gap-2 ${className}`}
          variants={variants} initial={initial} animate={animate}>
            {children}
        </motion.div>
    )
}
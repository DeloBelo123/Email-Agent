"use client"
import { motion } from "framer-motion"
import { Animation, normal } from "../Animations"
import BaseProps from "../BaseProps"
export default function Div({
    children,
    className,
    style,
    variants=normal,
    initial="hidden",
    animate="visible",
    }:BaseProps){
    return(
        <motion.div style={style} className={className} variants={variants} initial={initial} animate={animate}>
            {children}
        </motion.div>
    )
}
"use client"
import { motion } from "framer-motion"
import { Animation } from "../Animations"

export interface DivType {
    children?: React.ReactNode
    className?: string
    style?: React.CSSProperties
    variants?: Animation
    initial?: string
    animate?: string
}

export default function Div({
    children,
    className,
    style,
    variants,
    initial = "hidden",
    animate = "visible"
}: DivType) {
    return (
        <motion.div
            variants={variants}
            initial={initial}
            animate={animate}
            className={className}
            style={style}
        >
            {children}
        </motion.div>
    )
}

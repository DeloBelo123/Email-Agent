"use client"
import { motion } from "framer-motion"
import IconClamp from "../Clamps/IconClamp"
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from "lucide-react"
interface ArrowProps {
    className?: string;
    size?: "xs" | "small" | "mid" | "large" | "xl";
}
export function MyArrowRight({className,size="mid"}:ArrowProps){
    return(
        <motion.div className={` border rounded-full w-fit h-fit p-0.5 ${className}`}>
            <IconClamp size={size}>
                <ArrowRight className={`w-full h-full `} />
            </IconClamp>
        </motion.div>
    )
}

export function MyArrowLeft({className,size="mid"}:ArrowProps){
    return(
        <motion.div className={` border rounded-full w-fit h-fit p-0.5 ${className}`}>
            <IconClamp size={size}>
                <ArrowLeft className={`w-full h-full `} />
            </IconClamp>
        </motion.div>
    )
}

export function MyArrowUp({className,size="mid"}:ArrowProps){
    return(
        <motion.div className={` border rounded-full w-fit h-fit p-0.5 ${className}`}>
            <IconClamp size={size}>
                <ArrowUp className={`w-full h-full `} />
            </IconClamp>
        </motion.div>
    )
}

export function MyArrowDown({className,size="mid"}:ArrowProps){
    return(
        <motion.div className={` border rounded-full w-fit h-fit p-0.5 ${className}`}>
            <IconClamp size={size}>
                <ArrowDown className={`w-full h-full `} />
            </IconClamp>
        </motion.div>
    )
}
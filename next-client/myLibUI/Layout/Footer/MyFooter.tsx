"use client"

/* das ist die Footer komponente, unter dem kommen die ganzen Footer bestandteile */

import { motion } from "framer-motion"
import BaseProps from "../../BaseProps"
import { papa } from "../../Animations"
export default function MyFooter({
    variants=papa,
    initial="hidden",
    animate="visible",
    className,children
}:BaseProps){
    return(
        <motion.div
        className={` mt-10 flex flex-col gap-2 p-2 bg-gray-800 ${className} `}
        variants={variants} initial={initial} animate={animate}>
            {children}
        </motion.div>
    )
}
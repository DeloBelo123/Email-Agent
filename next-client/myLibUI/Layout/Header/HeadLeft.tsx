"use client"

/* ist der Teil vom Header der das Logo und den Titel der website hat */

import { motion } from "framer-motion";
import { Headprops } from "./MyHeader";
import { normalKinder } from "../../Animations";

export default function HeadLeft(
    {className,
    initial,animate,
    variants=normalKinder,
    logo,title}
    :Headprops){
    return(
        <motion.div variants={variants} initial={initial} animate={animate} className={` flex flex-gap-1 ${className}`}>
            {logo}
            {title}
        </motion.div>
    )
}
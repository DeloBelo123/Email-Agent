"use client"

/* hier kommt alles an kleinen links hin, kannst so viele machen wie du willst am besten
aber 3 weil die sonst ziemlich klein werden müssten für responsive-ness */

import React from "react";
import { Headprops } from "./MyHeader";
import { motion } from "framer-motion";
import { normalKinder } from "../../Animations";

export default function HeadMid({children,variants=normalKinder,animate,initial,className,}:Headprops){
    let childrenarr = React.Children.toArray(children)
    return(
        <motion.div className={` flex gap-1 ${className}`} variants={variants} animate={animate} initial={initial}>
            {childrenarr.map((item,index)=>{
                return (
                <motion.div key={index} className=" relative before:absolute before:content[``] before:bottom-[0.2] before:w-full before:h-1
                     before:bg-gray-900 before:scale-x-0 before:origin-center before:transition-all hover:before:scale-x-100 
                     before:ease-in-out before:duration-200 hover:scale-110 transition-all hover: scale-102 active:scale-98">
                        {item}
                </motion.div>)
            })}
        </motion.div>
    )
}
"use client"

/* das hier kommen alle Header komponenten hin, dient der aneinanderreihung an animation */

import { motion } from "framer-motion";
import BaseProps from "../../BaseProps";
import { papa } from "../../Animations";

export interface Headprops extends BaseProps {
    title?:React.ReactNode
    bgPic?:string
    logo?:React.ReactNode
    textClassName?:string
    SignUpOrIn?:boolean
    btn1Class?:string
    btn2Class?:string
    dark?:boolean
}
export default function MyHeader({children,bgPic,className,variants=papa,initial="hidden",animate="visible"}:Headprops){
    return(
        <motion.div variants={variants} initial={initial} animate={animate} className={` flex justify-between ${bgPic} ${className}`} >
            {children}
        </motion.div>
    )
}
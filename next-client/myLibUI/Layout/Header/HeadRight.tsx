"use client"

/* ist der rechte teil vom header, hat entweder das typische Login oder alles was du willst */

import { motion } from "framer-motion";
import { Headprops } from "./MyHeader";
import { normalKinder } from "../../Animations";
import Button from "../../Components/Button";
export default function HeadRight(
    {btn1Class,btn2Class,SignUpOrIn,children,dark=true,
    variants=normalKinder,initial,animate,className}
    :Headprops){
    return(
        <motion.div variants={variants} initial={initial} animate={animate}>
            { SignUpOrIn ?

             <motion.div className={` flex gap-1 ${className} `}>
                <Button className={`${btn1Class}`}>Sign In</Button>
                <Button dark={dark} className={`${btn2Class}`}>Sign Up</Button>
             </motion.div> 
             : 
             <motion.div variants={variants} initial={initial} animate={animate} className={`${className}`}>
                {children}
             </motion.div>
             
             }
        </motion.div>
    )
}
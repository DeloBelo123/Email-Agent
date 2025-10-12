"use client"
import { motion } from "framer-motion";
type Props = {
    children?:React.ReactNode
    className?:string
    länge?:number
    delay?:number
}
export default function StaggerWord({children,className,delay=0.1,länge = 0.05}:Props){
    const Wort = {hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:länge,delayChildren:delay}}}
    const Buchstabe = {hidden:{opacity:0,y:5},visible:{opacity:1,y:0}}
    let childrenArr = typeof children === "string" ? children?.split("") : null
    if(typeof children != "string"){
        console.error("ey gib einen string ein, kannst ihn durch 'className' auch so stylen wie ein <p>")
    }
    return(
        <motion.span className={`inline-block ${className}`} variants={Wort} initial="hidden" animate="visible">
            {childrenArr?.map((item,index)=>{
                return(
                    <motion.span key={index} variants={Buchstabe}>
                        {item}
                    </motion.span>  
                )
            })}
        </motion.span>
    )
}
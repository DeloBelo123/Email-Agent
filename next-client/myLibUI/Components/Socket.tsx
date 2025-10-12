"use client"
import { motion } from "framer-motion"
import BaseProps from "../BaseProps"
import IconClamp from "../Clamps/IconClamp"
import ImgClamp from "../Clamps/ImgClamp"
import {papa,spawningKinder} from "../Animations"
interface SocketProps extends BaseProps {
    src?:string
    icon?:React.ReactNode
}
export default function Socket(
    {className,
    src,size="mid",
    icon,title,
    initial="hidden",
    animate="visible"
}
    :SocketProps){
    if(src && icon){
        console.error("du kannst entweder nur img oder icon nutzen")
    }
    return(
        <motion.div
        variants={papa}
        initial={initial}
        animate={animate}
        className={`flex gap-1 items-center ${className}`}>
            <motion.header variants={spawningKinder}>
                { icon ?
                 <IconClamp size={size}>
                    {icon}
                 </IconClamp>
                 :
                 <ImgClamp src={src} size={size}/>
                }
            </motion.header>
            <motion.section variants={spawningKinder}>
                {title}
            </motion.section>
        </motion.div>
    )
}
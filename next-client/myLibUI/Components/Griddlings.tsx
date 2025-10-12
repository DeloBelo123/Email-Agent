"use client"
import { motion } from "framer-motion"
import { spawningKinder,Animation } from "../Animations"
import  TextClamp  from "../Clamps/TextClamp"
import ImgClamp from "../Clamps/ImgClamp"
interface props {
    children?:React.ReactNode
    icon?:React.ReactNode
    className?:string
    titleClass?:string
    title?:string
    variants?:Animation
    bild?:string | undefined
    bildClass?:string
    hoverShowBody?:boolean
}
export default function Griddlings(
    {children,
    icon,title,
    className,
    titleClass,
    bildClass,
    hoverShowBody=false,
    bild=undefined,
    variants=spawningKinder}
    :props){
    return(
        <>
            <motion.div variants={variants} className={` gap-1 transition-all hover:scale-105 duration-500 ease-in-out border p-5 relative group overflow-hidden ${className}`}>
            { bild && <ImgClamp min="20px" pref="30vw 30vh" max="2500px" aspectRatio="aspect-[3/5]"  src={bild}
                        className={` ${bildClass}`}/>}
                <header className="flex gap-1 ">
                    {!bild && <div>{icon}</div>}
                    <TextClamp min="22px" pref="3vw" max="30px"
                     className={` ${titleClass}`}>
                        {title}
                    </TextClamp>
                </header>
                <div className={`${hoverShowBody ? "border overflow-hidden transition-all duration-500 ease-in-out max-h-0 group-hover:max-h-40":""}`}>
                    {children}
                </div>
            </motion.div>
        </>
    )
}
"use client"
import { Animation } from "../Animations"
import { AnimatePresence, motion } from "framer-motion"
import BaseProps from "../BaseProps"
import { normal } from "../Animations"
import TextClamp from "../Clamps/TextClamp"
import { clamp } from "../Clamps/Clamp"
import { useState } from "react"
import IconClamp from "../Clamps/IconClamp"
interface SpezialInputProps extends BaseProps {
    iconVariant?:Animation
    iconInitial?:string
    iconAnimate?:string
    iconSize?: "xs" | "small" | "mid" | "large" | "xl"
    iconMin?:string
    iconPref?:string
    iconMax?:string
}
export default function Input(
    {variants=normal,
    initial="hidden",
    animate="visible",
    className,icon,
    dark=false,style,
    placeholder,inputType="text",
    iconSize,iconMin="20px",iconPref="4vw",iconMax="25px",
    placeholdReplacer,
    min="40px",pref="32vw",max="250px",
    BPHmin="15px",BPHpref="2.5vw",BPHmax="20px",
    foMin="15px",foPref="2.5vw",foMax="20px",
    topMin="3px",topPref="0.2vw",topMax="50px",
    leftMin="7px",leftPref="3vw",leftMax="10px",
    iconVariant=normal,iconAnimate="visible",iconInitial="hidden",
    onChange
    }:SpezialInputProps){
     const [nonactive,setNonactive] = useState<boolean>(true)
     function toggle(){
        setNonactive(false)
     }
    return(
        <motion.div
        variants={variants}
        initial={initial}
        animate={animate}
        style={style}
        className=" transition-all hover:scale-102 relative w-fit ">
            <label>
            <AnimatePresence>
                {nonactive
                    &&
                <motion.div
                 className="absolute text-gray-600"
                  style={{bottom:clamp(`${topMin}`,`${topPref}`,`${topMax}`),
                   left:clamp(`${leftMin}`,`${leftPref}`,`${leftMax}`)}}
                    exit={{opacity:0, y:1}}>
                    <TextClamp min={foMin} pref={foPref} max={foMax}>{placeholdReplacer}</TextClamp>
                </motion.div>}
            </AnimatePresence>
            <motion.input
            onFocus={toggle}
            onChange={onChange}
            type={inputType}
            style={{width: clamp(`${min}`,`${pref}`,`${max}`),
            fontSize:clamp(`${BPHmin}`,`${BPHpref}`,`${BPHmax}`)}}
            placeholder={placeholder}
            className={`p-1 pl-3 border rounded-2xl ${ dark ? "bg-gray-900 text-gray-200 border-white":""} ${className}`}
            />
            </label>
            <motion.div
             className={`absolute top-1 md:top-1.5 z-10 right-2 ${dark ? "text-gray-200":""}`}
              variants={iconVariant}
               initial={iconInitial}
                animate={iconAnimate}>
                 <IconClamp min={iconMin} pref={iconPref} max={iconMax} size={iconSize}>
                    {icon}
                 </IconClamp>
            </motion.div>
        </motion.div>
    )
}
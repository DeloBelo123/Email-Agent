"use client"

/* Hero action ist der wo man der "Call to action" nach gehen kann, ist
entweder ein Button oder ein Input wie immer */

import { motion } from "framer-motion"
import BaseProps from "../../BaseProps"
import Button from "../../Components/Button"
import Input from "../../Input"
import { spawningKinder } from "../../Animations"
interface HeroActionProps extends BaseProps{
    button?:boolean
    Bumin?:string // "Bu" steht für "Button"
    Bupref?:string
    Bumax?:string

    input?:boolean
    Inmin?:string //"In" steht für "Input"
    Inpref?:string
    Inmax?:string
    actionClass?:string
}


export default function HeroAction(
    {className,
    children,
    button,
    input,icon,
    variants=spawningKinder,
    initial,
    animate,placeholder,
    dark=false,placeholdReplacer,
    Bumin="12px",paMin="20px", 
    Bupref="1.5vw",paPref="1.5vw",
    Bumax="18px",paMax="30px",
    Inmin="40px",foMin,BPHmin,topMin,leftMin, 
    Inpref="32vw",foPref,BPHpref,topPref,leftPref,
    Inmax="250px",foMax,BPHmax,topMax,leftMax,
    onChange,onClick
    }:HeroActionProps){
        if(button === false && input === false){
            console.error("wähle button oder input")
        }
        if( button && input){
            console.error("nur einer kann true sein")
        }
    return(
        <motion.div variants={variants}>
            {
                button ? 

                    <Button
                     onClick={onClick}
                      initial={initial}
                       animate={animate}
                        min={Bumin} pref={Bupref} max={Bumax}
                         paMin={paMin} paPref={paPref} paMax={paMax}
                          className={className}
                           dark={dark}>
                            {children}
                    </Button>

                    :

                input ? 

                    <Input
                     onChange={onChange}
                     className={className} 
                     placeholder={placeholder} />

                    :

                    undefined
            }
        </motion.div>
    )
}
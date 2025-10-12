"use client";
//immernoch buggy aber scheiss drauf mach ich ganz später
import BaseProps from "../BaseProps";
import { motion } from "framer-motion";
import React from "react";

interface LooperProps extends BaseProps {
  LoopedOnes?: React.ReactNode[];
  speed?: number; 
  gap?: string; 
}

export default function Looper({
  className = "",
  gap = "gap-4",
  speed = 10,
  LoopedOnes = [],
}: LooperProps) {
 
  const items = [...LoopedOnes, ...LoopedOnes];

  return (
    <div className={`overflow-hidden w-full ${className}`}>
      <motion.div
        className={`flex ${gap}`}
        style={{ minWidth: "200%" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          duration: speed,
        }}
      >
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/*
    interface LoopedOnesProps extends BaseProps {
    logo?:boolean
    icon?:React.ReactNode
    loopDuration?:number
}
    
export default function LoopedOnes(
    {loopDuration=10,
    className,
    title,children,
    size="mid",logo,icon}
    :LoopedOnesProps){
    const loopVariant = {
        initial:{
            opacity:1,
            x:-200
        },
        animate:{
            opacity:1,
            x:200,
            transition:{
                duration:loopDuration,
                ease:"linear",
                repeat:Infinity,
            }
        }
    }
    return(
        <motion.div
        //@ts-ignore
         variants={loopVariant}
          initial="initial"
           animate="animate"
            className={`${className}`}>
            {logo ?
             <div className="flex gap-1 items-center">
                <IconClamp size={size}>
                    {icon}
                </IconClamp>
                <section>
                    {title}
                </section>
             </div>
             :
             <div>
                {children}
            </div>}
        </motion.div>
    )
}
*/
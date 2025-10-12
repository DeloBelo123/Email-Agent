"use client"
import {  motion } from "framer-motion"
import { normal } from "../Animations"
import { useRef } from "react"
import BaseProps from "../BaseProps"
interface VideoProps extends BaseProps {
    poster?:string,
    src?:string
    hoverStart?:boolean
    autoStart?:boolean
}
export default function Video({
    className,poster,
    variants=normal,initial="hidden",
    animate="visible",src,
    hoverStart=false,
    autoStart=true
}:VideoProps){
    const video = useRef<HTMLVideoElement>(null)
    if(autoStart && hoverStart){
        console.error("du kannst nicht hoverstart und autostart gleichzeitig haben, entscheide dich!")
    }
    function Play(){
        video.current?.play()
    }
    function Pause(){
        video.current?.pause()
    }
    return(
        <>
            <motion.video
            variants={variants}
             initial={initial}
              animate={animate} src={src}
               className={`${className}`}
                ref={video} poster={poster}
                 playsInline loop muted autoPlay={autoStart}
                  onMouseEnter={hoverStart ? Play:undefined}
                   onMouseLeave={hoverStart ? Pause:undefined} />
        </>
    )
}
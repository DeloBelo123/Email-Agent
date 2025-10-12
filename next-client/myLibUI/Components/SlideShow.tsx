"use client"
//kannst später auch so eine "slide from top" function oder so machen wo du nach y animierst und nicht x
import BaseProps from "../BaseProps"
import { motion,AnimatePresence } from "framer-motion"
import { spawningKinder, papa } from "../Animations"
import React, { useEffect, useState } from "react"
import { MyArrowLeft, MyArrowRight } from "./Arrows"
interface SlideShowProps extends BaseProps {
    ArrowLeft?:string
    ArrowRight?:string
    ArrowShow?:boolean
    autoscroll?:boolean
    autoscrollSpeed?:number
    transitionDuration?:number
}
export default function SlideShow(
    {ArrowShow=true,
    ArrowLeft,ArrowRight,
    className,children,
    autoscroll,autoscrollSpeed=1500,
    transitionDuration=0.6,}
    :SlideShowProps){
    const [slidableLeft, setSlidableLeft] = useState<boolean>(true)
    const [slidableRight, setSlidableRight] = useState<boolean>(true)
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [direction, setDirection] = useState<"left" | "right">("left")
    const slideVariants = {
        initial: (direction: "left" | "right") => ({
          x: direction === "left" ? -10 : 10,
          opacity: 0,
        }),
        animate: {
          x: 0,
          opacity: 1,
          transition: { duration:transitionDuration},
        },
        exit: (direction: "left" | "right") => ({
          x: direction === "left" ? 10 : -10,
          opacity: 0,
          transition: { duration:transitionDuration},
        }),
      }
    let childrenArr = children ? React.Children.toArray(children) : []
    function SlideLeft(){
        if (currentIndex > 0) {
            setDirection("right")
            setCurrentIndex(prev => prev -1)
        } else {
            setSlidableLeft(false)
        }
    }
    function SlideRight(){
        if (currentIndex < childrenArr.length - 1) {
            setDirection("left")
            setCurrentIndex(prev => prev + 1)
        } else {
            setSlidableRight(false)
        }
    }
    function none(){
        console.log("geht nicht weiter")
    }
    useEffect(() => {
        setSlidableLeft(currentIndex > 0);
        setSlidableRight(currentIndex < childrenArr.length - 1);
      }, [currentIndex, childrenArr.length]);
      useEffect(()=>{
        let timer: NodeJS.Timeout;
        if(!autoscroll) return;
        if(autoscroll){
             timer =  setInterval(()=>{
                if (currentIndex < childrenArr.length - 1) {
                    setDirection("left")
                    setCurrentIndex(prev => prev + 1)
                } else {
                    setCurrentIndex(0)
                }
            },autoscrollSpeed)
        }    
        return () => {
            clearInterval(timer);
          };
      },[autoscroll,currentIndex,childrenArr.length])
    return(
        <motion.div
         className={` w-fit flex items-center gap-2 ${className}`}
         variants={papa} initial={`hidden`} animate={`visible`}>
                {ArrowShow &&
                 <motion.div className=" w-fit" onClick={slidableLeft ? SlideLeft:none } variants={spawningKinder}>
                    <MyArrowLeft className={`  transition-all hover:scale-102 active:scale-98 ${slidableLeft ? "":" text-gray-500 opacity-65"} ${ArrowLeft}`}/>
                </motion.div>}
                    <AnimatePresence >
                        <section>
                            <motion.div
                             key={currentIndex}
                              custom={direction} initial="initial"
                               animate="animate" exit="exit"
                                variants={slideVariants}
                                 className="w-fit h-fit" >
                                {childrenArr.length > 0 ? childrenArr[currentIndex] : "keine Children"}
                            </motion.div>
                        </section>
                    </AnimatePresence>
                {ArrowShow && 
                <motion.div className=" w-fit" onClick={slidableRight ? SlideRight:none} variants={spawningKinder}>
                    <MyArrowRight className={` transition-all hover:scale-102 active:scale-98  ${slidableRight ? "":" text-gray-500 opacity-65"} ${ArrowRight}`}/>
                </motion.div>}
        </motion.div>
    )
}


import React from "react"
import { papa } from "../Animations"
import Div from "./Div"
import BaseProps from "../BaseProps"
export default function Gridder({children,className,variants=papa,initial="hidden",animate="visible"}:BaseProps){
    return(
        <Div
         variants={variants}
         initial={initial}
         animate={animate}
         className={` relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-8 ${className}`}>
            {children}
        </Div>
    )
}
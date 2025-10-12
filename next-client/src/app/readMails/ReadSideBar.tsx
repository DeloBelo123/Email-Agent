"use client"
import Sidebar from "../../../myLibUI/Components/Sidebar";
import Sideitem from "../../../myLibUI/Components/Sideitem";
import { Mail, Trash } from "lucide-react";
import { FaUserPlus } from "react-icons/fa6";
import { FaHome, FaHandshake } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import { GoLaw } from "react-icons/go";
import { quickSand } from "../../../myLibUI/Fonts";
import { useContext } from "react";
import { CategorieContext } from "./CategorieContext";

export default function ReadSideBar(){
    const { setCategorie } = useContext(CategorieContext)
    return(
        <>
            <Sidebar hoverbar className=" group gap-5 bg-blueish-black items-start">
                <div onClick={()=>{setCategorie("OverView")}}> 
                    <Sideitem className=" pb-5 pt-7 p-1 gap-2 pl-2" icon={<Mail className="w-full h-full text-creme-white"/>}>
                        <span className={`text-creme-white ${quickSand.className}`}>Overview</span>
                    </Sideitem>    
                </div>    
                <div onClick={()=>{setCategorie("neue_interessenten")}}>
                    <Sideitem className="p-1 gap-2 pl-2" icon={<FaUserPlus className=" w-full h-full text-creme-white"/>}>
                        <span className={`text-creme-white ${quickSand.className}`}>Leads</span>
                    </Sideitem>
                </div>
                <div onClick={()=>{setCategorie("bestehende_kunden")}}>
                    <Sideitem className="p-1 gap-2 pl-2" icon={<MdGroups className=" w-full h-full text-creme-white"/>}>
                        <span className={`text-creme-white ${quickSand.className}`}>Customers</span>
                    </Sideitem>     
                </div> 
                <div onClick={()=>{setCategorie("eigentuemer_verkaufsinteressenten")}}>
                   <Sideitem className="p-1 gap-2 pl-2" icon={<FaHome className=" w-full h-full text-creme-white"/>}>
                        <span className={`text-creme-white ${quickSand.className}`}>Landlord</span>
                    </Sideitem>       
                </div> 
                <div onClick={()=>{setCategorie("behoerdliche_rechtliche_themen")}}>
                    <Sideitem className="p-1 gap-2 pl-2" icon={<GoLaw className=" w-full h-full text-creme-white"/>}>
                        <span className={`text-creme-white ${quickSand.className}`}>Gouverment</span>
                    </Sideitem>
                </div>  
                <div onClick={()=>{setCategorie("marketing_kooperationen")}}>
                    <Sideitem className="p-1 gap-2 pl-2" icon={<FaHandshake className=" w-full h-full text-creme-white"/>}>
                        <span className={`text-creme-white ${quickSand.className}`}>Cooperations</span>
                    </Sideitem>
                </div>                
                <div onClick={()=>{setCategorie("spam_unwichtiges")}}>
                    <Sideitem className="p-1 gap-2 pl-2" icon={<Trash className=" text-creme-white"/>}>
                        <span className={`text-creme-white ${quickSand.className}`}>Spam</span>
                    </Sideitem>
                </div>
            </Sidebar>
        </>
    )
}















//version 1
/*
    "use client"
import Sidebar from "../../../Email-Agent/myLibUI/Components/Sidebar";
import Sideitem from "../../../Email-Agent/myLibUI/Components/Sideitem";
import { Mail, Trash } from "lucide-react";
import { FaUserPlus } from "react-icons/fa6";
import { FaHome, FaHandshake } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import { GoLaw } from "react-icons/go";
import { quickSand } from "../../../Email-Agent/myLibUI/Fonts";
import Link from "next/link";
import { useState } from "react";
import { MailCategories } from "./Mails";

export default function ReadSideBar(){
    const [categorie, setCategorie] = useState<keyof MailCategories>()
    return(
        <>
            <Sidebar hoverbar className=" group gap-5 bg-blueish-black items-start">
                <Link href={"/readMails/Categories/OverView"}>
                    <Sideitem className=" pb-5 pt-7 p-1 gap-2 pl-2" icon={<Mail className="w-full h-full text-creme-white"/>}>
                        <span className={`text-creme-white ${quickSand.className}`}>Overview</span>
                    </Sideitem>
                </Link>
                 <Link href={"/readMails/Categories/neue_interessenten"}>
                    <Sideitem className="p-1 gap-2 pl-2" icon={<FaUserPlus className=" w-full h-full text-creme-white"/>}>
                        <span className={`text-creme-white ${quickSand.className}`}>Leads</span>
                    </Sideitem>
                 </Link>
                <Link href={"/readMails/Categories/bestehende_kunden"}>
                    <Sideitem className="p-1 gap-2 pl-2" icon={<MdGroups className=" w-full h-full text-creme-white"/>}>
                        <span className={`text-creme-white ${quickSand.className}`}>Customers</span>
                    </Sideitem>
                </Link>
                <Link href={"/readMails/Categories/eigentuemer_verkaufsinteressenten"}>
                    <Sideitem className="p-1 gap-2 pl-2" icon={<FaHome className=" w-full h-full text-creme-white"/>}>
                        <span className={`text-creme-white ${quickSand.className}`}>Landlord</span>
                    </Sideitem>
                </Link>
                <Link href={"/readMails/Categories/behoerdliche_rechtliche_themen"}>
                    <Sideitem className="p-1 gap-2 pl-2" icon={<GoLaw className=" w-full h-full text-creme-white"/>}>
                        <span className={`text-creme-white ${quickSand.className}`}>Gouverment</span>
                    </Sideitem>
                </Link>
                <Link href={"/readMails/Categories/marketing_kooperationen"}>
                    <Sideitem className="p-1 gap-2 pl-2" icon={<FaHandshake className=" w-full h-full text-creme-white"/>}>
                        <span className={`text-creme-white ${quickSand.className}`}>Cooperations</span>
                    </Sideitem>
                </Link>
                <Link href={"/readMails/Categories/spam_unwichtiges"}>
                    <Sideitem className="p-1 gap-2 pl-2" icon={<Trash className=" text-creme-white"/>}>
                        <span className={`text-creme-white ${quickSand.className}`}>Spam</span>
                    </Sideitem>
                </Link>
            </Sidebar>
        </>
    )
}
*/

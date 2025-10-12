"use client"
import { useContext } from "react"
import { MailCategories } from "./Types"
import { Mails } from "./OldMails"
import ReadSideBar from "./ReadSideBar"
import { CategorieContext } from "./CategorieContext"
import OverView from "./OverView"
export default function ReadMailPage(){
    const { categorie } = useContext(CategorieContext)
    return(
        <div className="flex h-screen overflow-hidden">
            
            <div className="flex-1">
                <ReadSideBar/>
            </div>

            <div className="flex-100 h-full">
                {
                    categorie === "OverView" ?

                    <OverView/>

                    :

                    categorie ?

                    <Mails category={categorie as MailCategories}/> 

                    :

                    null
                }    
            </div>
        </div>
    )
}
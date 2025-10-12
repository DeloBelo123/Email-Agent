"use client"
import { createContext, ReactNode, useState } from "react";
import { AllCategories } from "./Types";

export const CategorieContext = createContext<any>(undefined)

export function CategorieContextProvider({children}:{children:ReactNode}){
    const [categorie,setCategorie] = useState<AllCategories>("OverView")
    return(
        <CategorieContext.Provider value={{categorie,setCategorie}}>
            {children}
        </CategorieContext.Provider>
    )
}
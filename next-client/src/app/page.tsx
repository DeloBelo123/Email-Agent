"use client"

import { useState, useEffect } from "react"
import { SwipeContainer } from "@/components/swipe/SwipeContainer"
import ReadMails from "./readMails/page"
import WriteMails from "./writeMails/page"

export default function Main() {
    const [currentPage, setCurrentPage] = useState(0)
    useEffect(() => {
        const handleNavigateToPage = (event: CustomEvent) => {
            setCurrentPage(event.detail.page)
        }

        window.addEventListener('navigateToPage', handleNavigateToPage as EventListener)
        return () => window.removeEventListener('navigateToPage', handleNavigateToPage as EventListener)
    }, [])

    return (
        <div className="w-screen h-screen">
            <SwipeContainer 
                currentPage={currentPage} 
                onPageChange={setCurrentPage}
            >
                <ReadMails />
                <WriteMails />
            </SwipeContainer>
        </div>
    )
}



/*
  <GoogleAuth btn size="small" scopes="https://mail.google.com/" redirectTo="http://localhost:3000/readMails" />
*/


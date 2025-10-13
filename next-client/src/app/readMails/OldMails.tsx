"use client"
import { useMutation } from "@tanstack/react-query"
import { sendSession, supabase } from "../../../myLibUI/Backend/supabase/supabase"
import { PythonResponse, Email, MailCategories } from "./Types"
import { useEffect, useState } from "react"
import { mailTabelle } from "../../../myLibUI/Backend/supabase/sb_tables"
import { useReply } from "../ReplyContext"
import { motion, AnimatePresence } from "framer-motion"
import NotLoggedInScreen from "../../components/auth/NotLoggedInScreen"
import { makeDummyMails } from "./DummyData"

export function Mails({category,dummyTest = false}:{category: MailCategories, dummyTest?: boolean}){
    const [mails, setMails] = useState<any | undefined>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [expandedMails, setExpandedMails] = useState<Set<string>>(new Set())
    const { setReplyData } = useReply()


    const dummyMails = makeDummyMails(category)
    const getCategoryDisplayName = (category: string) => {
        switch (category) {
            case 'neue_interessenten': return 'Leads'
            case 'bestehende_kunden': return 'Customers'
            case 'eigentuemer_verkaufsinteressenten': return 'Landlord'
            case 'behoerdliche_rechtliche_themen': return 'Gouverment'
            case 'marketing_kooperationen': return 'Cooperations'
            case 'spam_unwichtiges': return 'Spam'
            default: return category.replace('_', ' ').toUpperCase()
        }
    }

    const { mutate, error:postError } = useMutation({
        mutationFn: async () => {
            return await sendSession<PythonResponse>({
                toBackend:"http://localhost:8000/read_emails/test3",
            })
        },  
        onSuccess: async (result) => {
            console.log("Backend hat geantwortet", result.data)
            console.log("Status:", result.status)
            
            if (result.status === 401) {
                console.warn("User ist nicht eingeloggt - Demo-Modus aktiviert")
                setMails(dummyMails)
                return
            }
            console.log("Session Info:", result.session)
            
            try {
                const { data: { user }, error } = await supabase.auth.getUser()
                console.log("User:", user)
                console.log("Auth Error:", error)
                
                if (error) {
                    console.error("Auth Error:", error)
                    setIsLoading(false)
                    return
                }
                
                if (!user) {
                    console.log("No user found")
                    setIsLoading(false)
                    return
                }
                console.log("Fetching mails for category:", category, "user:", user.id)
                const allUserMails = await mailTabelle.select({
                    columns: ["*"],
                    where: [
                        {column: "inhaber_id", is: user.id}
                    ]
                }) as any[]
                const mails_of_category = allUserMails
                    .filter((mail: any) => 
                        mail.mail_category === category || 
                        mail.mail_category === null ||
                        category === 'spam_unwichtiges' // Show all uncategorized mails as spam for now
                    )
                    .map((mail: any) => ({
                        ...mail,
                        mail_header: mail.mail_header || `Unknown Sender <unknown@example.com>`,
                        mail_summary: mail.mail_summary || mail.mail_body.substring(0, 100) + '...',
                        mail_category: mail.mail_category || category
                    }))
                
                console.log("Filtered mails for category:", mails_of_category)
                
                if (dummyTest) {
                    setMails(dummyMails)
                } else {
                setMails(mails_of_category)
                }
                setIsLoading(false)
            } catch (dbError) {
                console.error("DB Error:", dbError)
                setIsLoading(false)
            }
        },
        onError: (error) => {
            console.error("Error fetching mails:", error)
            setIsLoading(false)
        }
    })
    if (postError) throw new Error("ein fehler beim posten an python backend: " + postError)
    
    useEffect(()=>{
        console.log("Component mounted, checking auth for category:", category)
        
        const checkAuthAndLoadData = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                console.log("User eingeloggt - lade echte Daten")
                setIsLoggedIn(true)
        mutate()
            } else {
                console.log("User nicht eingeloggt - zeige Login-Screen")
                setIsLoggedIn(false)
                setIsLoading(false)
            }
        }
        checkAuthAndLoadData()
    },[category])

    // Show login screen if user is not logged in
    if (!isLoggedIn) {
        return <NotLoggedInScreen />
    }

    if (isLoading) {
        return (
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex-shrink-0 bg-primary-black px-6 py-4">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-creme-white">
                            {getCategoryDisplayName(category)}
                        </h2>
                        <p className="text-sm text-light-gray">
                            Lade...
                        </p>
                    </div>
                </div>
                
                {/* Loading State */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex items-center gap-3 text-light-gray">
                        <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-creme-white rounded-full animate-spin"></div>
                        <span className="text-sm">Lade Mails...</span>
                    </div>
                </div>
            </div>
        )
    }
    
    if (!mails || mails.length === 0) {
        return (
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex-shrink-0 bg-primary-black px-6 py-4">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-creme-white">
                            {getCategoryDisplayName(category)}
                        </h2>
                        <p className="text-sm text-light-gray">
                            0 E-Mails
                        </p>
                    </div>
                </div>
                
                {/* Empty State */}
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                    <div className="w-16 h-16 bg-blueish-black rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">📧</span>
                    </div>
                    <h3 className="text-lg font-semibold text-creme-white mb-2">Keine Mails gefunden</h3>
                    <p className="text-light-gray text-sm">Es wurden keine E-Mails in dieser Kategorie gefunden.</p>
                </div>
            </div>
        )
    }
    
    return(
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 bg-primary-black px-6 py-4">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-creme-white">
                        {getCategoryDisplayName(category)}
                    </h2>
                    <p className="text-sm text-light-gray">
                        {mails?.length || 0} E-Mails
                    </p>
                </div>
            </div>
            
            {/* Scrollable Mail List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-blue/30 scrollbar-track-transparent">
                <motion.div 
                    className="max-w-6xl mx-auto space-y-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.1,
                                delayChildren: 0.2
                            }
                        }
                    }}
                >
                    {mails?.map((mail: Email, index: number) => {
                    // Parse sender info from mail_header
                    const senderMatch = mail.mail_header.match(/(.+?)\s*<(.+?)>/)
                    const senderName = senderMatch ? senderMatch[1].trim() : mail.mail_header
                    const senderEmail = senderMatch ? senderMatch[2].trim() : ""
                    
                    // Kategorie-Farben mit Dark/Light Mode Support
                    const getCategoryColor = (category: string) => {
                        switch (category) {
                            case 'neue_interessenten': return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-500/30'
                            case 'bestehende_kunden': return 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30'
                            case 'eigentuemer_verkaufsinteressenten': return 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-500/30'
                            case 'behoerdliche_rechtliche_themen': return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-500/30'
                            case 'marketing_kooperationen': return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-500/30'
                            case 'spam_unwichtiges': return 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-500/30'
                            default: return 'bg-gray-blue/20 text-light-gray border-gray-300 dark:border-gray-600'
                        }
                    }

                    const getCategoryDisplayName = (category: string) => {
                        switch (category) {
                            case 'neue_interessenten': return 'Leads'
                            case 'bestehende_kunden': return 'Customers'
                            case 'eigentuemer_verkaufsinteressenten': return 'Landlord'
                            case 'behoerdliche_rechtliche_themen': return 'Gouverment'
                            case 'marketing_kooperationen': return 'Cooperations'
                            case 'spam_unwichtiges': return 'Spam'
                            default: return getCategoryDisplayName(category)
                        }
                    }
                    
                    return(
                        <motion.div 
                            key={mail.unique_mail_id}
                            className="bg-blueish-black/30 hover:bg-blueish-black/50 rounded-2xl shadow-md p-4 transition-all duration-200 hover:shadow-lg group"
                            variants={{
                                hidden: { 
                                    opacity: 0, 
                                    y: 20,
                                    scale: 0.95
                                },
                                visible: { 
                                    opacity: 1, 
                                    y: 0,
                                    scale: 1,
                                    transition: {
                                        duration: 0.5,
                                        ease: "easeOut"
                                    }
                                }
                            }}
                            layout
                        >
                            {/* Header - Kategorie Badge und Datum */}
                            <div className="flex items-center justify-between mb-4">
                                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(mail.mail_category)}`}>
                                    {getCategoryDisplayName(mail.mail_category)}
                                </div>
                                <div className="text-xs text-light-gray">
                                    {new Date().toLocaleDateString('de-DE')}
                                </div>
                            </div>

                            {/* Body - From, Subject, Summary */}
                            <div className="mb-4 space-y-2">
                                {/* From - Fett mit Icon */}
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-gray-blue rounded-full flex items-center justify-center">
                                        <span className="text-sm text-creme-white font-semibold">
                                            {senderName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="font-bold text-creme-white text-base">
                                        {senderName}
                                    </div>
                                </div>

                                {/* Subject - Mittlere Schriftgröße, hervorgehoben */}
                                <div className="text-gray-blue font-semibold text-lg">
                                    {mail.mail_summary}
                                </div>

                                {/* Summary - Kleinere Schrift, max 3 Zeilen, klickbar */}
                                <div 
                                    className="text-light-gray text-base line-clamp-3 leading-relaxed cursor-pointer hover:text-creme-white transition-colors"
                                    onClick={() => {
                                        // Toggle für vollständigen Mail-Body
                                        setExpandedMails(prev => {
                                            const newSet = new Set(prev)
                                            if (newSet.has(mail.unique_mail_id)) {
                                                newSet.delete(mail.unique_mail_id)
                                            } else {
                                                newSet.add(mail.unique_mail_id)
                                            }
                                            return newSet
                                        })
                                    }}
                                >
                                    {mail.mail_body.substring(0, 150)}...
                                    <span className="text-xs text-gray-blue ml-2">
                                        ({expandedMails.has(mail.unique_mail_id) ? 'Klicken zum Ausblenden' : 'Klicken zum Anzeigen'})
                                    </span>
                                </div>

                                {/* Vollständiger Mail-Body - Mit Animation */}
                                <AnimatePresence>
                                    {expandedMails.has(mail.unique_mail_id) && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0, y: -10 }}
                                            animate={{ opacity: 1, height: "auto", y: 0 }}
                                            exit={{ opacity: 0, height: 0, y: -10 }}
                                            transition={{ 
                                                duration: 0.3, 
                                                ease: "easeOut",
                                                height: { duration: 0.3, ease: "easeOut" }
                                            }}
                                            className="text-light-gray text-base leading-relaxed whitespace-pre-wrap bg-primary-black/10 rounded-lg p-3 mt-2 overflow-hidden"
                                        >
                                            {mail.mail_body}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer - Action Buttons */}
                            <motion.div 
                                className="flex justify-end gap-1 pt-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + (index * 0.1), duration: 0.3 }}
                            >
                                <motion.button 
                                    className="bg-gray-blue hover:bg-gray-blue/80 dark:bg-gray-blue dark:hover:bg-gray-blue/80 text-primary-black dark:text-primary-black text-xs font-medium py-1 px-2 rounded-md transition-all duration-150 hover:scale-105 active:scale-95 transform"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        // Extract email from mail_header
                                        const senderMatch = mail.mail_header.match(/(.+?)\s*<(.+?)>/)
                                        const senderEmail = senderMatch ? senderMatch[2].trim() : ""
                                        
                                        // Set reply data and navigate to write page
                                        setReplyData({
                                            to: senderEmail,
                                            subject: mail.mail_summary,
                                            from: "user@example.com" // This should be the user's email
                                        })

                                        // Navigate to write page (page 1 in SwipeContainer)
                                        const event = new CustomEvent('navigateToPage', { detail: { page: 1 } })
                                        window.dispatchEvent(event)
                                    }}
                                >
                                    Antworten
                                </motion.button>
                                
                                <motion.button 
                                    className="border border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500 text-light-gray hover:text-creme-white dark:text-light-gray dark:hover:text-creme-white text-xs font-medium py-1 px-2 rounded-md transition-all duration-150 hover:scale-105 active:scale-95 transform"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Archivieren
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    )
                })}
                </motion.div>
            </div>
        </div>
    )
}
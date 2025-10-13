
export type SubscriptionLevel = "STARTER" | "ADVANCED" | "PREMIUM"
export interface AboFeatures {
    maxWriteMail:number | "unlimited",
    autoPilot:boolean,
    CRMIntergration:boolean,
    betterEngine?:boolean
}
export function getUserFeatures(abo:SubscriptionLevel):AboFeatures | undefined{
    switch(abo){
        case "STARTER":
            return {
                maxWriteMail:125,
                autoPilot:false,
                CRMIntergration:false,
                betterEngine:false
            }
        case "ADVANCED":
            return {
                maxWriteMail:"unlimited",
                autoPilot:false,
                CRMIntergration:true,
                betterEngine:true
            }
        case "PREMIUM":
            return {
                maxWriteMail:"unlimited",
                autoPilot:true,
                CRMIntergration:true,
                betterEngine:true
            }
        default:
            throw new Error("Unknown subscription abo: " + abo)
    }
}
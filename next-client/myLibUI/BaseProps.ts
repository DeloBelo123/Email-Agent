import { Animation } from "./Animations"
export default interface BaseProps {
    className?:string
    style?:object
    children?:React.ReactNode
    initial?:string
    animate?:string
    variants?:Animation
    exit?:any
    papavariants?:Animation

    max?:string
    min?:string
    pref?:string
    paMax?:string //"pa" steht für "padding"
    paMin?:string
    paPref?:string
    foMin?:string //"fo" steht für "font"
    foPref?:string
    foMax?:string
    topMin?:string //für top property
    topPref?:string
    topMax?:string
    leftMin?:string //für left property
    leftPref?:string
    leftMax?:string
    BPHmin?:string //"BPH" steht für "BasicPlaceHolder"
    BPHpref?:string
    BPHmax?:string

    size?: "xs" | "small" | "mid" | "large" | "xl"
    iconSize?: "xs" | "small" | "mid" | "large" | "xl"

    textClass?:string
    dark?:boolean
    placeholder?:string
    placeholdReplacer?:React.ReactNode
    PHRClass?:string // "PHR" steht für "PlaceHolderReplacer"
    icon?:React.ReactNode
    title?:React.ReactNode
    titleClass?:string
    inputType?:string
    onClick?:React.MouseEventHandler<HTMLElement>
    onChange?:React.ChangeEventHandler<HTMLInputElement>
}

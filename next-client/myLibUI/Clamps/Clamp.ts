export type styleClamp = typeof clamp
export const clamp = (min:string,pref:string,max:string) => {
    return `clamp(${min},${pref},${max})`
}
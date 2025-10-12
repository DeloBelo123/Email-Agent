import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 
    | "default" 
    | "destructive" 
    | "outline" 
    | "secondary" 
    | "ghost" 
    | "link"
    | "email"
    | "send"
  size?: 
    | "default" 
    | "sm" 
    | "lg" 
    | "xl" 
    | "icon"
    | "responsive"
    | "responsive-sm"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    // Base classes
    const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    
    // Variant classes
    const variantClasses = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      email: "bg-blueish-black text-creme-white hover:bg-gray-blue border border-light-gray",
      send: "bg-green-600 text-white hover:bg-green-700 shadow-lg",
    }
    
    // Size classes
    const sizeClasses = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-6 text-base",
      xl: "h-12 rounded-lg px-8 text-lg",
      icon: "h-9 w-9",
      responsive: "h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm md:h-10 md:px-6 md:text-base lg:h-12 lg:px-8 lg:text-lg",
      "responsive-sm": "h-7 px-2 text-xs sm:h-8 sm:px-3 sm:text-sm md:h-9 md:px-4 md:text-sm",
    }
    
    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    )   
    
    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

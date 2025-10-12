import {
     Pacifico,
     Playfair_Display,
     Quicksand
       }
     
from "next/font/google"

type Font = {
    className: string
    variable?: string
  };

export const pacifico: Font = Pacifico({ //extreme kurvig und wavy, wie extreme schreibschrift
    subsets:['latin'],
    weight: '400'
})

export const playfairDisplay: Font = Playfair_Display({ //professionell, so wie diese alte schrift von zeitungen die so noch mit stempeln gedruckt wurden 
    subsets:['latin'],
    weight: '400'
})

export const quickSand: Font = Quicksand({ // sieht futuristic aus, gefühlt wie "mono-space"
    subsets:['latin'],
    weight: '400'
})

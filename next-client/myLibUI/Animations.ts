export interface Animation {
    [key: string]:{
        [property: string]: any
    }
}

export const normal: Animation = {
    hidden:{
        opacity:0
    },
    visible:{
        opacity:1,
        transition:{
            duration:0.7
        }
    }
}

export const spawning: Animation = {
    hidden:{
        opacity:0,
        y:10
    },
    visible:{
        opacity:1,
        y:0,
        transition:{
            duration:0.7
        }
    }
}

export const papa: Animation = {
    hidden:{
        opacity:0
    },
    visible:{
        opacity:1,
        transition:{
            staggerChildren:0.1,
            delayChildren:0.3
        }
    }
}
export const innerSpawningPapa = {
    hidden:{
        opacity:0,
        y:10
    },
    visible:{
        opacity:1,
        y:0,
        transition:{
            staggerChildren:0.1,
            delayChildren:0.3
        }
    }
}
export const normalKinder: Animation = {
    hidden:{
        opacity:0
    },
    visible:{
        opacity:1
    }
}

export const spawningKinder: Animation = {
    hidden:{
        opacity:0,
        y:10
    },
    visible:{
        opacity:1,
        y:0
    }
}
    





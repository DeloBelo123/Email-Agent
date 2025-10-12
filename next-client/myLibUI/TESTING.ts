import { supabase } from "./Backend/supabase/supabase"
//intern sieht supabase ungefähr so aus:
class SuperBase {
    private url:string
    private apikey:string

    constructor(url:string,apikey:string){
        this.url = url
        this.apikey = apikey
    }
    //blabla, noch weitere methoden...
}
function createClient(x:string,y:string){
    return new SuperBase(x,y)
}

class auther{
    SignInWithAuth(){
        //blabla, hier passiert viel code
    }
}

class superbase{
    private url:string
    private apikey:string
    private auth: auther

    constructor(url:string,apikey:string){
        this.url = url
        this.apikey = apikey
        this.auth = new auther()
    }
}

class Arm {
    public arm_richtung: "links" | "rechts"
    constructor(arm_richtung: "links" | "rechts"){
        this.arm_richtung = arm_richtung
    }
    winken(){
        console.log(`ich habe mit ${this.arm_richtung} gewunken! `)
    }
}

interface menschenProps {
    name:string
    alter:number 
}
class Mensch {
    public name:string
    public alter:number
    public arm_links: Arm
    public arm_rechts: Arm
    constructor({name,alter}:menschenProps){
        this.name = name
        this.alter = alter
        this.arm_links = new Arm("links")
        this.arm_rechts = new Arm("rechts")
    }
    sprechen(text:string){
        console.log(text)
    }
}

const Ich = new Mensch({name:"delo",alter:17})

Ich.arm_links.winken()
Ich.arm_rechts.winken()
Ich.sprechen("Hallo, ich bin Delo und ich bin 17 Jahre alt!")

//supabase snippets

const { data:{ user } , error:auth_error } = await supabase.auth.getUser() // gibt uns "user-blueprint", der von dem aktuell eingeloggten dann die data bekommt
let data_demo = { // nur zur veranschaulichung
    user:{
        id: "",
        email: "",
        app_metadata:"",
        user_metadata: ""
    },
    error: null
}

function eventer(event:string,callback:Function){
    callback(event)
}

eventer("klick",(event:string)=>{
    console.log("ich werde klick sein, guck:" + event)
})





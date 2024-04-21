import { CustomData } from "./CustomData";

export class Input extends CustomData{
    private text:string;
    private description:string;
    private title:string;
    public constructor(title:string="",description:string="",text:string=""){
        super();
        this.title=title;
        this.description=description;
        this.text=text;
    }
    public getValue(){
        return this.text;
    }
    public setValue(value:string){
        this.useValue(value);
    }
    public useValue(value:string){
        this.text=value;
    }
    public loadForm(fm:CustomForm){
        fm.addInput(this.title,this.description,this.text);
    }
    public getInt():number|null{
        if(this.text.length==0){
            return 0;
        }
        else if(this.text.charAt(0)=='-'){
            let num=0;
            for(let i=1;i<this.text.length;i++){
                switch(this.text.charAt(i)){
                    case '0': num*=10; num-=0; break;
                    case '1': num*=10; num-=1; break;
                    case '2': num*=10; num-=2; break;
                    case '3': num*=10; num-=3; break;
                    case '4': num*=10; num-=4; break;
                    case '5': num*=10; num-=5; break;
                    case '6': num*=10; num-=6; break;
                    case '7': num*=10; num-=7; break;
                    case '8': num*=10; num-=8; break;
                    case '9': num*=10; num-=9; break;
                    default: return null;
                }
            }
            return num;
        }
        else{
            let num=0;
            for(let i=0;i<this.text.length;i++){
                switch(this.text.charAt(i)){
                    case '0': num*=10; num+=0; break;
                    case '1': num*=10; num+=1; break;
                    case '2': num*=10; num+=2; break;
                    case '3': num*=10; num+=3; break;
                    case '4': num*=10; num+=4; break;
                    case '5': num*=10; num+=5; break;
                    case '6': num*=10; num+=6; break;
                    case '7': num*=10; num+=7; break;
                    case '8': num*=10; num+=8; break;
                    case '9': num*=10; num+=9; break;
                    default: return null;
                }
            }
            return num;
        }
    }
    public getNumber():number|null{
        let num=0;
        let tempNum=1;
        let point=false;
        if(this.text.length==0){
            return 0;
        }
        else if(this.text.charAt(0)=='-'){
            for(let i=1;i<this.text.length;i++){
                switch(this.text.charAt(i)){
                    case '0': if(point){ tempNum*=0.1; num-=tempNum*0}else{ num*=10; num-=0 } break;
                    case '1': if(point){ tempNum*=0.1; num-=tempNum*1}else{ num*=10; num-=1 } break;
                    case '2': if(point){ tempNum*=0.1; num-=tempNum*2}else{ num*=10; num-=2 } break;
                    case '3': if(point){ tempNum*=0.1; num-=tempNum*3}else{ num*=10; num-=3 } break;
                    case '4': if(point){ tempNum*=0.1; num-=tempNum*4}else{ num*=10; num-=4 } break;
                    case '5': if(point){ tempNum*=0.1; num-=tempNum*5}else{ num*=10; num-=5 } break;
                    case '6': if(point){ tempNum*=0.1; num-=tempNum*6}else{ num*=10; num-=6 } break;
                    case '7': if(point){ tempNum*=0.1; num-=tempNum*7}else{ num*=10; num-=7 } break;
                    case '8': if(point){ tempNum*=0.1; num-=tempNum*8}else{ num*=10; num-=8 } break;
                    case '9': if(point){ tempNum*=0.1; num-=tempNum*9}else{ num*=10; num-=9 } break;
                    case '.': if(!point) point=true; else return null; break;
                    default: return null;
                }
            }
            return num;
        }
        else{
            for(let i=0;i<this.text.length;i++){
                switch(this.text.charAt(i)){
                    case '0': if(point){ tempNum*=0.1; num+=tempNum*0}else{ num*=10; num+=0 } break;
                    case '1': if(point){ tempNum*=0.1; num+=tempNum*1}else{ num*=10; num+=1 } break;
                    case '2': if(point){ tempNum*=0.1; num+=tempNum*2}else{ num*=10; num+=2 } break;
                    case '3': if(point){ tempNum*=0.1; num+=tempNum*3}else{ num*=10; num+=3 } break;
                    case '4': if(point){ tempNum*=0.1; num+=tempNum*4}else{ num*=10; num+=4 } break;
                    case '5': if(point){ tempNum*=0.1; num+=tempNum*5}else{ num*=10; num+=5 } break;
                    case '6': if(point){ tempNum*=0.1; num+=tempNum*6}else{ num*=10; num+=6 } break;
                    case '7': if(point){ tempNum*=0.1; num+=tempNum*7}else{ num*=10; num+=7 } break;
                    case '8': if(point){ tempNum*=0.1; num+=tempNum*8}else{ num*=10; num+=8 } break;
                    case '9': if(point){ tempNum*=0.1; num+=tempNum*9}else{ num*=10; num+=9 } break;
                    case '.': if(!point) point=true; else return null; break;
                    default: return null;
                }
            }
            return num;
        }
    }
}
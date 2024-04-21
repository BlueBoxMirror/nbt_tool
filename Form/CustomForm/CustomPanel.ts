import { Panel } from "../Panel";
import { CustomData } from "./CustomData";
import { Input } from "./Input";

export class CustomPanel extends Panel{
    private custom_array:Array<CustomData>=[];
    public title:string;
    public constructor(title:string=""){
        super();
        this.title=title;
    }
    public get(index:number):CustomData{
        return this.custom_array[index];
    }
    public add(custom:CustomData):CustomData{
        this.custom_array.push(custom);
        return custom;
    }
    public remove(key:number|CustomData){
        if(key instanceof Number){
            this.custom_array.splice(<number>key,1);
        }
        else if(key instanceof CustomData){
            for(let i=this.custom_array.length;i>=0;i--){
                if(key==this.custom_array[i]){
                    this.custom_array.splice(i,1);
                }
            }
        }
    }
    public action:(player:Player,panel:Panel)=>void=(player,panel)=>{};
    public send:(player:Player)=>void=(player)=>{
        const fm=mc.newCustomForm();
        fm.setTitle(this.title);
        this.custom_array.forEach(custom=>{
            custom.loadForm(fm);
        })
        player.sendForm(fm,(player,data)=>{
            if(data==null){
                this.closeAction(player,this);
            }
            else{
                for(let i=0;i<this.custom_array.length;i++){
                    this.custom_array[i].useValue(data[i]);
                }
                this.action(player,this);
            }
        })
    }
}
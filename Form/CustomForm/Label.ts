import { CustomData } from "./CustomData";

export class Label extends CustomData{
    public useValue(value: string): void {
        this.text=value;
    }
    public setText(value:string):void{
        this.useValue(value);
    }
    public constructor(text:string=''){
        super();
        this.text=text;
    }
    private text:string;
    public getValue():string{
        return this.text;
    }
    public loadForm(fm:CustomForm){
        fm.addLabel(this.text);
    }
}
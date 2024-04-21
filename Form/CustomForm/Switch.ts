import { CustomData } from "./CustomData";

export class Switch extends CustomData{
    private isSelect:boolean;
    private title:string;
    public constructor(title="",isSelect=false){
        super();
        this.title=title;
        this.isSelect=isSelect;
    }
    public setSelected(value:boolean){
        this.useValue(value);
    }
    public isSelected(){
        return this.getValue();
    }
    public getValue(){
        return this.isSelect;
    }
    public useValue(value:boolean){
        this.isSelect=value;
    }
    public loadForm(fm:CustomForm){
        fm.addSwitch(this.title,this.isSelect);
    }
}
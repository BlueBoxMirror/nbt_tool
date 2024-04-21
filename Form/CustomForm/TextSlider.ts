import { CustomData } from "./CustomData";

export class TextSlider extends CustomData{
    private list:Array<string>;
    private selectIndex:number;
    private title:string;
    public constructor(title:string="",list:Array<string>=[],selectIndex:number=0){
        super();
        this.title=title;
        this.list=list;
        this.selectIndex=selectIndex;
    }
    public getSelected(){
        return this.getValue();
    }
    public getSelectedIndex(){
        return this.selectIndex;
    }
    public setSelectedIndex(index:number){
        this.useValue(index);
    }
    public setSelected(value:string){
        for(let i=0;i<this.list.length;i++){
            if(value==this.list[i]){
                this.useValue(i);
            }
        }
    }
    public getValue(){
        return this.list[this.selectIndex];
    }
    public useValue(value:number){
        this.selectIndex=value;
    }
    public loadForm(fm:CustomForm){
        fm.addStepSlider(this.title,this.list,this.selectIndex);
    }
}
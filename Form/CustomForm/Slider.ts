import { CustomData } from "./CustomData";

export class Slider extends CustomData{
    private selectNumber:number;
    private max:number;
    private min:number;
    private step:number;
    private title:string;
    constructor(title:string="",min:number=0,max:number=100,step:number=1,selectNumber:number=min){
        super();
        this.title=title;
        this.selectNumber=selectNumber;
        this.min=min;
        this.max=max;
        this.step=step;
        this.selectNumber=selectNumber;
    }
    public getSelected(){
        return this.getValue();
    }
    public setSelected(value:number){
        this.useValue(value);
    }
    public getValue(){
        return this.selectNumber;
    }
    public useValue(value:number){
        this.selectNumber=value;
    }
    public loadForm(fm:CustomForm){
        fm.addSlider(this.title,this.min,this.max,this.step,this.selectNumber);
    }
}
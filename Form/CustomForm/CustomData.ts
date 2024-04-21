
export abstract class CustomData{
    public abstract getValue():any;
    public abstract loadForm(form:CustomForm):void;
    public abstract useValue(value:any):void;
}
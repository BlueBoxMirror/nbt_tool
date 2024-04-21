export class IO{
    public static readFrom(path:string):string|null{
        return File.readFrom(path);
    }
    public static writeTo(path:string,text:string):boolean{
        return File.writeTo(path,text);
    }
    public static exists(path:string):boolean{
        return File.exists(path);
    }
}
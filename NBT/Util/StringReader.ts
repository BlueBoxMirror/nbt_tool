export class StringReader{
    public constructor(str:string){
        this.str=str;
    }
    public readonly str:string;
    private index=0;
    public hasNext(){
        return this.index<this.str.length
    }
    public next(){
        return this.str.charAt(this.index++);
    }
    public peek(){
        return this.str.charAt(this.index);
    }
    public left(step=1){
        this.index-=step;
    }
    public right(step=1){
        this.index+=step;
    }
    public toString(){
        return '<'+this.str+'>['+this.index+']'
    }
    public error(message:string){
        return '§c错误的语法格式:'+message+'发生在§e'+this.str.substring(Math.max(0,this.index-7),this.index)+'§c§l>'+this.str.charAt(this.index)+'<§r§e'+this.str.substring(this.index+1,Math.min(this.index+7,this.str.length));
    }
    public skipWarp(){
        while(this.hasNext()){
            switch(this.peek()){
                case ' ':
                case '\n':
                    this.right();
                    break;
                default:
                    return;
            }
        }
    }
}
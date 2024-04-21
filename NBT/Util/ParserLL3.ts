import { IParser } from "./IParser";
import { ParserLL2 } from "./ParserLL2";
import { StringReader } from "./StringReader";

export class ParserLL3 implements IParser{
    public parseSNBT(snbt: string): NbtType {
        const reader=new StringReader(snbt);
        const result=ParserLL3.parseValue(reader);
        reader.skipWarp();
        if(reader.hasNext()) throw new Error(reader.error('冗余部分'));
        return result;
    }
    public toSNBT(nbt: NbtType): string {
        return ParserLL3.toSNBT(nbt);
    }
    public static parseValue(reader:StringReader):NbtType{
        reader.skipWarp();
        if(!reader.hasNext()) throw new Error(reader.error('空的表达式'))
        const ch=reader.peek();
        switch(ch){
            case '[':
                return this.parseList(reader);
            case '{':
                return this.parseCompound(reader);
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '-':
            case '+':
                return ParserLL2.parseNumberNbt(reader);
            default:
                return this.parseStringNBT(reader);
        }
    }
    public static parseCompound(reader:StringReader):NbtCompound{
        const nbt=new NbtCompound({});
        if(reader.next()=='{'){
            while(reader.hasNext()){
                reader.skipWarp();
                const ch=reader.next();
                if(ch=='}') return nbt;
                else{
                    reader.left();
                    const key=this.toSNBT(this.parseStringNBT(reader));
                    reader.skipWarp();
                    if(reader.next()!=':'){
                        reader.left();
                        throw new Error(reader.error('应为 :'));
                    }
                    nbt.setTag(key,this.parseValue(reader));
                    reader.skipWarp();
                    const ch1=reader.next();
                    if(ch1==','){}
                    else if(ch1=='}') return nbt;
                    else{
                        reader.left();
                        throw new Error(reader.error('应为 ,'));
                    }
                }
            }
        }
        reader.left();
        throw new Error(reader.error('应为 {'));
    }
    public static parseList(reader:StringReader):NbtList{
        const nbt=new NbtList([]);
        if(reader.next()=='['){
            while(reader.hasNext()){
                reader.skipWarp();
                const ch=reader.next();
                if(ch==']') return nbt;
                else{
                    reader.left();
                    nbt.addTag(this.parseValue(reader));
                    reader.skipWarp();
                    const ch1=reader.next();
                    if(ch1==','){}
                    else if(ch1==']') return nbt;
                    else{
                        reader.left();
                        throw new Error(reader.error('应为 ,'));
                    }
                }
            }
        }
        reader.left();
        throw new Error(reader.error('应为 ['));
    }
    public static toSNBT(rawNbt:NbtType):string{
        let str='';
        switch(rawNbt.getType()){
            case NBT.Compound:{
                const nbt=<NbtCompound>rawNbt;
                if(nbt.getKeys().length==0) return '{}';
                str+='{';
                nbt.getKeys().forEach(key=>{
                    str+=key+':'+this.toSNBT(nbt.getTag(key)!)+',';
                })
                return str.substring(0,str.length-1)+'}'
            }
            case NBT.List:{
                const nbt=<NbtList>rawNbt;
                if(nbt.getSize()==0) return '[]'
                str+='[';
                for(let i=0;i<nbt.getSize();i++){
                    str+=this.toSNBT(nbt.getTag(i)!)+',';
                }
                return str.substring(0,str.length-1)+']'
            }
            case NBT.String:{
                const reader=new StringReader((<NbtString>rawNbt).get());
                let str='';
                let needMark=false;
                if(reader.hasNext() && (48<=reader.peek().charCodeAt(0) && reader.peek().charCodeAt(0)<=57)) needMark=true;
                while(reader.hasNext()){
                    const ch=reader.next();
                    const charCode=ch.charCodeAt(0);
                    if(needMark){}
                    if((65<=charCode && charCode<=90)||(97<=charCode && charCode<=122)||(48<=charCode && charCode<=57)||ch=='.'||ch=='_'){}
                    else needMark=true;
                    switch(ch){
                        case '"':
                        case "'":
                        case '\\':
                            str+='\\'+ch;
                            break;
                        case '\n':
                            str+='\\n';
                            break;
                        default:
                            str+=ch;
                    }
                }
                return needMark?'"'+str+'"':str;
            }
            case NBT.Byte:
                return (<NbtByte>rawNbt).get()+'b';
            case NBT.Int:
                return (<NbtInt>rawNbt).get()+'';
            case NBT.Short:
                return (<NbtShort>rawNbt).get()+'s';
            case NBT.Long:
                return (<NbtByte>rawNbt).get()+'l';
            case NBT.Float:
                return (<NbtByte>rawNbt).get()+'f';
            case NBT.Double:
                return (<NbtByte>rawNbt).get()+'d';
        }
        throw new Error('错误的NBT');
    }
    public static parseStringNBT(reader:StringReader):NbtString{
        const start=reader.peek();
        let mark=false;
        if(start=='"' || start =="'"){
            reader.right();
            mark=true;
        }
        let str='';
        while(reader.hasNext()){
            const ch=reader.next();
            const charCode=ch.charCodeAt(0);
            if((65<=charCode && charCode<=90)||(97<=charCode && charCode<=122)||(48<=charCode && charCode<=57)||ch=='.'||ch=='_'){}
            else if((ch=='"'&&start=='"')||(ch=="'"&&start=="'")){
                return new NbtString(str);
            }
            else if(!mark){
                reader.left();
                return new NbtString(str);
            }
            if(ch=='\\'){
                if(!reader.hasNext()) throw new Error(reader.error('应转义'));
                const ch1=reader.next();
                switch(ch1){
                    case '"':
                    case "'":
                    case '\\':
                        str+=ch1;
                        break;
                    case 'n':
                        str+='\n';
                        break;
                    default:
                        reader.left();
                        throw new Error(reader.error('错误或不支持的转义'));
                }
            }
            else str+=ch;
        }
        if(mark) throw new Error(reader.error('应为 '+start));
        return new NbtString(str);
    }
}
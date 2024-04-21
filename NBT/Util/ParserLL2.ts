import { IParser } from "./IParser";
import { StringReader } from "./StringReader";

export class ParserLL2 implements IParser{
    public parseSNBT(snbt:string){
        const reader=new StringReader(snbt);
        const result=ParserLL2.parseValue(reader);
        reader.skipWarp();
        if(reader.hasNext()) throw new Error(reader.error('冗余部分'));
        return result;
    }
    public toSNBT(rawNbt:NbtType){
        return ParserLL2.toSNBT(rawNbt);
    }
    public static toSNBT(rawNbt:NbtType){
        let str='';
        switch(rawNbt.getType()){
            case NBT.Compound:{
                const nbt=<NbtCompound>rawNbt;
                if(nbt.getKeys().length==0) return '{}';
                str+='{';
                nbt.getKeys().forEach(key=>{
                    str+='"'+key+'":'+this.toSNBT(nbt.getTag(key)!)+',';
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
                const nbt=<NbtString>rawNbt;
                let str=nbt.get();
                str=str.replace(/\\\\n/gm,'\\n');
                str=str.replace(/\\\\"/gm,'\\"');
                str=str.replace(/\\\\'/gm,"\\'");
                str=str.replace(/\\\\\\\\/gm,'\\\\');
                return '"'+str+'"';
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
    //屎山代码警告
    public static parseNumberNbt(reader:StringReader):NbtInt|NbtByte|NbtFloat|NbtDouble|NbtShort|NbtLong{
        let num=0;//数
        let point=false;//小数点
        let negative=false;//负数
        let start=false;//是否开始
        let e_start=false;//是否开始科学计数
        let e=false;//科学计数
        let e_number=0;//10^?
        let e_negative=false;//科学计数倒数
        let times=0.1;//小数位数
        while(reader.hasNext()){
            const ch=reader.next();
            switch(ch){
                case 'e':
                case 'E':
                    if(!start || e){
                        reader.left();
                        throw new Error(reader.error('数字格式错误'));
                    }
                    else{
                        e=true;
                    }
                    break;
                case 's':
                case 'S':
                    if(!start){
                        reader.left();
                        throw new Error(reader.error('数字格式错误'));
                    }
                    return new NbtShort((negative?-num:num)*(e?Math.pow(10,e_negative?-e_number:e_number):1));
                case 'b':
                case 'B':
                    if(!start){
                        reader.left();
                        throw new Error(reader.error('数字格式错误'));
                    }
                    return new NbtByte((negative?-num:num)*(e?Math.pow(10,e_negative?-e_number:e_number):1));
                case 'l':
                case 'L':
                    if(!start){
                        reader.left();
                        throw new Error(reader.error('数字格式错误'));
                    }
                    return new NbtLong((negative?-num:num)*(e?Math.pow(10,e_negative?-e_number:e_number):1));
                case 'f':
                case 'F':
                    if(!start){
                        reader.left();
                        throw new Error(reader.error('数字格式错误'));
                    }
                    return new NbtFloat((negative?-num:num)*(e?Math.pow(10,e_negative?-e_number:e_number):1));
                case 'd':
                case 'D':
                if(!start){
                    reader.left();
                    throw new Error(reader.error('数字格式错误'));
                }
                return new NbtDouble((negative?-num:num)*(e?Math.pow(10,e_negative?-e_number:e_number):1));
                case '.':
                    if(!start || point){
                        reader.left();
                        throw new Error(reader.error('数字格式错误'));
                    }
                    point=true;
                break;
                case '+':
                    if(e){
                        if(e_start){
                            reader.left();
                            throw new Error(reader.error('数字格式错误'));
                        }
                        else{
                            e_start=true;
                        }
                    }
                    else if(start){
                        reader.left();
                        throw new Error(reader.error('数字格式错误'));
                    }
                    else{
                        start=true;
                    }
                    break;
                case '-':
                    if(e){
                        if(e_start){
                            reader.left();
                            throw new Error(reader.error('数字格式错误'));
                        }
                        else{
                            e_negative=true;
                            e_start=true;
                        }
                    }
                    else if(start){
                        reader.left();
                        throw new Error(reader.error('数字格式错误'));
                    }
                    else if(negative || (e && e_negative)){
                        reader.left();
                        throw new Error(reader.error('数字格式错误'));
                    }
                    else{
                        negative=true;
                        start=true;
                    }
                break;
                case '0':
                    start=true;
                    if(e){
                        e_number=e_number*10+0;
                    }
                    else if(point){
                        num=num+0*times
                        times*=0.1;
                    }
                    else num=num*10+0;
                break;
                case '1':
                    start=true;
                    if(e){
                        e_number=e_number*10+1;
                    }
                    else if(point){
                        num=num+1*times
                        times*=0.1;
                    }
                    else num=num*10+1;
                break;
                case '2':
                    start=true;
                    if(e){
                        e_number=e_number*10+2;
                    }
                    else if(point){
                        num=num+2*times
                        times*=0.1;
                    }
                    else num=num*10+2;
                break;
                case '3':
                    start=true;
                    if(e){
                        e_number=e_number*10+3;
                    }
                    else if(point){
                        num=num+3*times
                        times*=0.1;
                    }
                    else num=num*10+3;
                break;
                case '4':
                    start=true;
                    if(e){
                        e_number=e_number*10+4;
                    }
                    else if(e){
                        e_number=e_number*10+4;
                    }
                    else if(point){
                        num=num+4*times
                        times*=0.1;
                    }
                    else num=num*10+4;
                break;
                case '5':
                    start=true;
                    if(e){
                        e_number=e_number*10+5;
                    }
                    else if(point){
                        num=num+5*times
                        times*=0.1;
                    }
                    else num=num*10+5;
                break;
                case '6':
                    start=true;
                    if(e){
                        e_number=e_number*10+6;
                    }
                    else if(point){
                        num=num+6*times
                        times*=0.1;
                    }
                    else num=num*10+6;
                break;
                case '7':
                    start=true;
                    if(e){
                        e_number=e_number*10+7;
                    }
                    else if(point){
                        num=num+7*times
                        times*=0.1;
                    }
                    else num=num*10+7;
                break;
                case '8':
                    start=true;
                    if(e){
                        e_number=e_number*10+8;
                    }
                    else if(point){
                        num=num+8*times
                        times*=0.1;
                    }
                    else num=num*10+8;
                break;
                case '9':
                    start=true;
                    if(e){
                        e_number=e_number*10+9;
                    }
                    else if(point){
                        num=num+9*times
                        times*=0.1;
                    }
                    else num=num*10+9;
                break;
                default:
                    reader.left();
                    return point?new NbtDouble((negative?-num:num)*(e?Math.pow(10,e_negative?-e_number:e_number):1)):new NbtInt((negative?-num:num)*(e?Math.pow(10,e_negative?-e_number:e_number):1));
            }
        }
        return point?new NbtDouble(negative?-num:num):new NbtInt(negative?-num:num);
    }
    public static parseString(reader:StringReader):string{
        reader.skipWarp();
        let str='';
        if(reader.next()=='"'){
            while(reader.hasNext()){
                const ch=reader.next();
                if(ch=='"'){
                    return str;
                }
                else if(ch=='\\'){
                    switch(reader.next()){
                        case 'n':
                            str+='\n';
                            break;
                        case '\\':
                            str+='\\';
                            break;
                        case '"':
                            str+='"';
                            break;
                        case "'":
                            str+="'";
                            break;
                        default:
                            reader.left();
                            throw new Error(reader.error('错误或不支持的转义'));
                    }
                }
                else{
                    str+=ch;
                }
            }
        }
        reader.left();
        throw new Error(reader.error('应为 "'));
    }
    public static parseCompound(reader:StringReader):NbtCompound{
        const nbt=new NbtCompound({});
        if(reader.next()=='{'){
            while(reader.hasNext()){
                reader.skipWarp();
                const ch=reader.next();
                if(ch=='}') return nbt;
                else if(ch=='"'){
                    reader.left();
                    const key=this.parseString(reader);
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
                else{
                    reader.left();
                    throw new Error(reader.error('应为 "'));
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
    public static parseValue(reader:StringReader):NbtType{
        reader.skipWarp();
        if(!reader.hasNext()) throw new Error(reader.error('空的表达式'))
        const ch=reader.peek();
        switch(ch){
            case '"':
                return new NbtString(this.parseString(reader));
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
                return this.parseNumberNbt(reader);
            case '[':
                return this.parseList(reader);
            case '{':
                return this.parseCompound(reader);
            default:
                throw new Error(reader.error('未知的格式'));
        }
    }

}
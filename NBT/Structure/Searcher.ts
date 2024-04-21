import { LinkedNbt } from "./LinkedNbt";

export class Searcher{
    public static fullMatch(root:LinkedNbt,word:string,onePage=false){
        const result:LinkedNbt[]=[];
        root.forEach((nbt)=>{
            if(nbt.type==NBT.List||nbt.type==NBT.Compound){
                if(onePage) return;
                this.fullMatch(nbt,word).forEach(value=>{
                    result.push(value);
                })
            }
            else{
                if(nbt.snbt==word) result.push(nbt);
            }
        })
        return result;
    }
    public static localMatch(root:LinkedNbt,word:string,onePage=false){
        const result:LinkedNbt[]=[];
        root.forEach((nbt)=>{
            if(nbt.type==NBT.List||nbt.type==NBT.Compound){
                if(onePage) return;
                this.localMatch(nbt,word).forEach(value=>{
                    result.push(value);
                })
            }
            else{
                if(nbt.snbt.includes(word)) result.push(nbt);
            }
        })
        return result;
    }
    public static intervalMatch(root:LinkedNbt,word:string,onePage=false){
        const left=Number(word.substring(0,word.indexOf('~')));
        const right=Number(word.substring(word.indexOf('~')+1));
        const result:LinkedNbt[]=[];
        root.forEach((nbt)=>{
            if(nbt.type==NBT.List||nbt.type==NBT.Compound){
                if(onePage) return;
                this.intervalMatch(nbt,word).forEach(value=>{
                    result.push(value);
                })
            }
            else if(nbt.type==NBT.Byte || nbt.type==NBT.Short || nbt.type==NBT.Int || nbt.type==NBT.Long || nbt.type==NBT.Float || nbt.type==NBT.Double){
                const center=nbt.getNbt().get();
                if(left<=center && center<=right){
                    result.push(nbt);
                }
            }
        })
        return result;
    }
    public static minMatch(root:LinkedNbt,word:string,onePage=false){
        const min=Number(word);
        const result:LinkedNbt[]=[];
        root.forEach((nbt)=>{
            if(nbt.type==NBT.List||nbt.type==NBT.Compound){
                if(onePage) return;
                this.minMatch(nbt,word).forEach(value=>{
                    result.push(value);
                })
            }
            else if(nbt.type==NBT.Byte || nbt.type==NBT.Short || nbt.type==NBT.Int || nbt.type==NBT.Long || nbt.type==NBT.Float || nbt.type==NBT.Double){
                const center=nbt.getNbt().get();
                if(min<=center){
                    result.push(nbt);
                }
            }
        })
        return result;
    }
    public static maxMatch(root:LinkedNbt,word:string,onePage=false){
        const max=Number(word);
        const result:LinkedNbt[]=[];
        root.forEach((nbt)=>{
            if(nbt.type==NBT.List||nbt.type==NBT.Compound){
                if(onePage) return;
                this.maxMatch(nbt,word).forEach(value=>{
                    result.push(value);
                })
            }
            else if(nbt.type==NBT.Byte || nbt.type==NBT.Short || nbt.type==NBT.Int || nbt.type==NBT.Long || nbt.type==NBT.Float || nbt.type==NBT.Double){
                const center=nbt.getNbt().get();
                if(max>=center){
                    result.push(nbt);
                }
            }
        })
        return result;
    }
    public static keyMatch(root:LinkedNbt,word:string,onePage=false){
        const result:LinkedNbt[]=[];
        root.forEach((nbt)=>{
            if(nbt.type==NBT.List){
                if(onePage) return;
                this.keyMatch(nbt,word).forEach(value=>{
                    result.push(value);
                })
            }
            else if(nbt.type==NBT.Compound){
                if((<string>nbt.prevKey).includes(word)) result.push(nbt);
            }
        })
        return result;
    }
}
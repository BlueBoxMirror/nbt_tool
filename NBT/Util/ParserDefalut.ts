import { IParser } from "./IParser";

export class ParserDefault implements IParser{
    public constructor(){
        this.index=new NbtCompound({a:new NbtString("b")}).toSNBT().indexOf(':')+1;
        switch(this.index){
            case 5: this.llVersion='LiteLoader2'; break;
            case 3: this.llVersion='LeviLamina'; break;
            default: this.llVersion='Unknow'; break;
        }
    }
    private readonly index:number;
    public readonly llVersion:string;
    public parseSNBT(snbt: string): NbtType {
        return NBT.parseSNBT('{"a":'+snbt+'}')!.getTag('a')!;
    }
    public toSNBT(nbt: NbtType): string {
        const str=new NbtCompound({a:nbt}).toSNBT();
        return str.substring(this.index,str.length-1);
    }

}
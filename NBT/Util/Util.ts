import { Config } from "./Config";
import { ParserLL2 } from "./ParserLL2";
import { StringReader } from "./StringReader";

export class Util{
    /**
     * 转换NBT类型为字符串
     * @param nbtType NBT类型(int)
     * @returns NBT类型字符串
     */
    public static typeToString(nbtType:Number):string{
        switch(nbtType){
            case NBT.Byte:
                return "Byte";
            case NBT.ByteArray:
                return "ByteArray";
            case NBT.Compound:
                return "Compound";
            case NBT.Double:
                return "Double";
            case NBT.End:
                return "End";
            case NBT.Float:
                return "Float";
            case NBT.Int:
                return "Int";
            case NBT.List:
                return "List";
            case NBT.Long:
                return "Long";
            case NBT.Short:
                return "Short";
            case NBT.String:
                return "String";
            default:
                return "Unknow";
        }
    }
    /**
     * NBT转换为SNBT字符串
     * @param nbt NBT 
     * @returns SNBT字符串
     */
    public static toSNBT(rawNbt:NbtType):string{
        return Config.parser.toSNBT(rawNbt);
    }
    /**
     * SNBT字符串转换为NBT
     * @param snbt SNBT字符串 
     * @returns NBT
     */
    public static parseSNBT(snbt:string):NbtType{
        return Config.parser.parseSNBT(snbt);
    }
    public static nbtToBlock(nbt:NbtCompound,pos:IntPos){
        mc.setBlock(pos,nbt.getTag('nbt') as NbtCompound);
        const block=mc.getBlock(pos)!;
        if(nbt.getTag('entity')!=null) block.getBlockEntity().setNbt(nbt.getTag('entity') as NbtCompound);
        if(nbt.getTag('container')!=null) this.nbtToContainer(block.getContainer(),nbt.getTag('container') as NbtList);
    }
    public static blockToNbt(block:Block):NbtCompound{
        const nbt=new NbtCompound({});
        nbt.setTag('nbt',block.getNbt());
        if(block.hasContainer()) nbt.setTag('container',this.containerToNbt(block.getContainer()));
        if(block.hasBlockEntity()) nbt.setTag('entity',block.getBlockEntity().getNbt());
        return nbt;
    }
    /**
     * 将容器对象转换为NBTList序列
     * @param container 容器
     * @returns NBTList序列
     */
    public static containerToNbt(container:Container):NbtList{
        const list=new NbtList([]);
        container.getAllItems().forEach(item=>{
            list.addTag(item.getNbt());
        })
        return list;
    }
    /**
     * 将NBTList序列传至容器对象
     * @param container 原容器对象
     * @param nbt NBTList序列
     */
    public static nbtToContainer(container:Container,nbt:NbtList){
        for(let i=0;i<nbt.getSize();i++){
            container.setItem(i,<Item>mc.newItem(<NbtCompound>nbt.getTag(i)));
        }
    }
}
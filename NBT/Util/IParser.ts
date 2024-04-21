export interface IParser{
    parseSNBT(snbt:string):NbtType
    toSNBT(nbt:NbtType):string
}
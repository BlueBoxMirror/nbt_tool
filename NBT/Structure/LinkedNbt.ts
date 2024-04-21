import { Util } from "../Util/Util";

export class LinkedNbt{
    private value:NbtType;
    private _prev:LinkedNbt|null;
    private _prevKey:string|number|null;
    /**
     * 动态树结构 NBT 
     * @param nbt 原NBT 
     * @param prev 上一个节点
     * @param prevKey 上一个节点Key
     */
    public constructor(nbt:NbtType,prev:LinkedNbt|null=null,prevKey:string|number|null=null){
        this.value=nbt;
        this._prev=prev;
        this._prevKey=prevKey;
    }
    public get prev(){
        return this._prev;
    }
    public get path():string{
        if(this._prev==null) return '/';
        else return this._prev.path+this._prevKey+'/';
    }
    public toString(){
        return (this._prev==null?'':'§d'+this._prevKey+'§8:')+'§c'+this.strType+' §8'+this.snbt;
    }
    public get root(){
        if(this._prev==null) return this;
        else return this._prev.root;
    }
    public get snbt(){
        return Util.toSNBT(this.value);
    }
    public get strType(){
        return Util.typeToString(this.type);
    }
    public get type(){
        return this.value.getType();
    }
    public getNbt(){
        return <any>this.value;
    }
    public setNbt(nbt:NbtType){
        this.value=nbt;
        if(this._prev==null) return;
        this._prev.getNbt().setTag(this._prevKey,this.value);
    }
    public delete(){
        if(this._prev==null) return;
        this._prev.getNbt().removeTag(this._prevKey);
    }
    public next(key:string|number){
        return new LinkedNbt(this.getNbt().getTag(key),this,key);
    }
    public hasNext():boolean{
        return this.value.getType()==NBT.List||this.value.getType()==NBT.Compound;
    }
    public get prevKey(){
        return this._prevKey;
    }
    public forEach(consumer:(nbt:LinkedNbt)=>void){
        switch(this.value.getType()){
            case NBT.List:
                for(let i=0;i<this.getNbt().getSize();i++){
                    consumer(this.next(i));
                }
                break;
            case NBT.Compound:
                this.getNbt().getKeys().forEach((key:string)=>{
                    consumer(this.next(key));
                })
                break;
        }
    }
}
import { ButtonData } from "../../Form/SimpleForm/ButtonData";
import { ButtonPanel } from "../../Form/SimpleForm/ButtonPanel";
import { Station } from "../GUI/Station";
import { LinkedNbt } from "../Structure/LinkedNbt";
import { Config } from "../Util/Config";
import { Util } from "../Util/Util";
import { DataMap } from "./DataMap";
import { IO } from "./IO";

export class PlayerData{
    private static dataMap=new Map<string,PlayerData>();
    public constructor(player:Player){
        this.player=player;
        this.load();
    }
    public readonly player:Player;
    public clipboard:string|null;
    public readonly savedNbt=new DataMap('NBT收藏夹');
    public readonly savedBlock=new DataMap('方块收藏夹');
    public readonly savedItem=new DataMap('物品收藏夹');
    public readonly savedEntity=new DataMap('生物收藏夹');

    public get path(){
        return Config.saved_snbt_path+this.player.xuid+'.json';
    }
    public load(){
        if(!IO.exists(this.path)){
            this.save();
        }
        else{
            this.fromObject(JSON.parse(IO.readFrom(this.path)!));
        }
        this.savedNbt.suggestNameRoot=Config.suggest_name.snbt;
        this.savedBlock.suggestNameRoot=Config.suggest_name.block;
        this.savedEntity.suggestNameRoot=Config.suggest_name.entity;
        this.savedItem.suggestNameRoot=Config.suggest_name.item;
    }
    public save(){
        IO.writeTo(this.path,JSON.stringify(this.toObject(),null,2));
    }
    public openGUI(){
        const fm=new ButtonPanel('收藏夹',this.player.realName+' 这是您的收藏夹');
        fm.add(new ButtonData(this.savedNbt.title,(player,index,panel)=>{
            panel.open(player,this.savedNbt.GUIforManage(()=>{this.save()},(panel,key,data)=>{
                panel.add(new ButtonData('修改SNBT',()=>{
                    Station.GUIforNBT(new LinkedNbt(Util.parseSNBT(data)),(root)=>{
                        this.savedNbt.set(key,root.snbt);
                        this.save();
                        this.openGUI();
                    }).send(player);
                }))
            }));
        }))
        fm.add(new ButtonData(this.savedBlock.title,(player,index,panel)=>{
            panel.open(player,this.savedBlock.GUIforManage(()=>{this.save()},(panel,key,data)=>{
                panel.add(new ButtonData('修改SNBT',()=>{
                    Station.GUIforNBT(new LinkedNbt(Util.parseSNBT(data)),(root)=>{
                        this.savedBlock.set(key,root.snbt);
                        this.save();
                        this.openGUI();
                    }).send(this.player);
                }));
                panel.add(new ButtonData('放置于脚下',(player)=>{
                    Util.nbtToBlock(Util.parseSNBT(data) as NbtCompound,player.blockPos);
                }))
            }));
        }))
        fm.add(new ButtonData(this.savedEntity.title,(player,index,panel)=>{
            panel.open(player,this.savedEntity.GUIforManage(()=>{this.save()},(panel,key,data)=>{
                panel.add(new ButtonData('修改SNBT',()=>{
                    Station.GUIforNBT(new LinkedNbt(Util.parseSNBT(data)),(root)=>{
                        this.savedEntity.set(key,root.snbt);
                        this.save();
                        this.openGUI();
                    }).send(this.player);
                }))
                panel.add(new ButtonData('生成于脚下',(player)=>{
                    const nbt=Util.parseSNBT(data) as NbtCompound;
                    const entityType=nbt.getData('identifier');
                    nbt.setTag('Pos',player.getNbt().getTag('Pos')!);
                    const entity=mc.spawnMob(entityType,player.feetPos);
                    if(entity==null){
                        player.tell('生成失败');
                        return;
                    }
                    entity.setNbt(nbt);
                }))
            }));
        }))
        fm.add(new ButtonData(this.savedItem.title,(player,index,panel)=>{
            panel.open(player,this.savedItem.GUIforManage(()=>{this.save()},(panel,key,data)=>{
                panel.add(new ButtonData('修改SNBT',()=>{
                    Station.GUIforNBT(new LinkedNbt(Util.parseSNBT(data)),(root)=>{
                        this.savedItem.set(key,root.snbt);
                        this.save();
                        this.openGUI();
                    }).send(this.player);
                }))
                panel.add(new ButtonData('获取此物品',(player)=>{
                    player.getInventory().addItem(mc.newItem(Util.parseSNBT(data) as NbtCompound)!);
                    player.refreshItems();
                }))
            }));
        }))
        fm.send(this.player);
    }
    public toObject(){
        return {
            nbt:this.savedNbt.map,
            item:this.savedItem.map,
            block:this.savedBlock.map,
            entity:this.savedEntity.map,
        }
    }
    public fromObject(obj:Record<string,Record<string,string>>){
        this.savedNbt.fromObject(obj.nbt);
        this.savedItem.fromObject(obj.item);
        this.savedEntity.fromObject(obj.entity);
        this.savedBlock.fromObject(obj.block);
    }
    public static get(player:Player){
        return this.dataMap.get(player.xuid);
    }
    public static reload(){
        this.dataMap.forEach(data=>{
            data.load();
        })
    }
    public useBlock:number=0;
    static{
        mc.listen('onJoin',(player)=>{
            const playerData=new PlayerData(player);
            this.dataMap.set(player.xuid,playerData);
        })
        mc.listen('onLeft',(player)=>{
            const playerData=this.get(player)!;
            playerData.save();
            this.dataMap.delete(player.xuid);
        })
    }
}
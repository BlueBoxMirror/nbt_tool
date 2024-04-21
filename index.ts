// LiteLoader-AIDS automatic generated
/// <reference path="d:\main\BDS/dts/llaids/src/index.d.ts"/> 

import { PlayerData } from "./NBT/Data/PlayerData";
import { Station } from "./NBT/GUI/Station";
import { LinkedNbt } from "./NBT/Structure/LinkedNbt";
import { Config } from "./NBT/Util/Config";
import { Util } from "./NBT/Util/Util";

ll.registerPlugin(
    /* name */ "nbt_tool",
    /* introduction */ "NBT工具_nodejs",
    /* version */ [1,0,0],
    /* otherInformation */ {
        auther:'bluebox'
    }
); 

mc.listen('onServerStarted',()=>{
    Config.load();
    {
    const callback=function(cmd:Command,origin:CommandOrigin,output:CommandOutput,result:{collectionItemName:string,collectionEntityName:string,collectionBlockName:string,rootEnum:'item'|'block'|'entity'|'get_nbt_stick'|'collection'|'reload',collectionEnum:'block'|'item'|'entity'|null,blockPos:IntPos,pos:FloatPos,entity:Entity[]}){
        const player=mc.getPlayer(origin.player!.xuid);
        const playerData=PlayerData.get(player)!;
        switch(result.rootEnum){
            case 'item':{
                const item=player.getHand();
                Station.GUIforNBT(new LinkedNbt(item.getNbt()),(root)=>{
                    item.setNbt(root.getNbt());
                    player.refreshItems();
                    player.tell('修改成功');
                }).send(player);
                output.success('');
            }
            break;
            case 'block':{
                const block=mc.getBlock(result.blockPos);
                if(block==null){
                    output.error('无法访问此方块');
                    return;
                }
                Station.GUIforBlock(block,()=>{
                    player.tell('修改成功');
                }).send(player);
                output.success('');
            }
            break;
            case 'entity':{
                if(result.entity.length!=1) output.error('传入的实体数量不为1');
                const entity=result.entity[0];
                Station.GUIforEntity(entity,()=>{
                    entity.refreshItems();
                    player.tell('修改成功');
                }).send(player);
                output.success('');
            }
            break;
            case 'reload':{
                Config.load();
                output.success('重加载配置');
            }
            break;
            case 'collection':{
                switch(result.collectionEnum){
                    case 'block':
                        if(!playerData.savedBlock.has(result.collectionBlockName)){
                            output.error('没有找到名为"'+result.collectionBlockName+'"的收藏方块');
                            return;
                        }
                        Util.nbtToBlock(Util.parseSNBT(playerData.savedBlock.get(result.collectionBlockName)!) as NbtCompound,result.blockPos);
                        output.success('方块已放置')
                        break;
                    case 'entity':
                        if(!playerData.savedEntity.has(result.collectionEntityName)){
                            output.error('没有找到名为"'+result.collectionEntityName+'"的收藏实体');
                            return;
                        }
                        const nbt=Util.parseSNBT(playerData.savedEntity.get(result.collectionEntityName)!) as NbtCompound;
                        const entityType=nbt.getData('identifier');
                        nbt.setTag('Pos',new NbtList([new NbtFloat(result.pos.x),new NbtFloat(result.pos.y),new NbtFloat(result.pos.z)]));
                        const entity=mc.spawnMob(entityType,result.pos);
                        if(entity==null){
                            player.tell('生成失败');
                            return;
                        }
                        entity.setNbt(nbt);
                        output.success('生物已生成')
                        break;
                    case 'item':
                        if(!playerData.savedBlock.has(result.collectionBlockName)){
                            output.error('没有找到名为"'+result.collectionBlockName+'"的收藏方块');
                            return;
                        }
                        Util.nbtToBlock(Util.parseSNBT(playerData.savedBlock.get(result.collectionBlockName)!) as NbtCompound,result.blockPos);
                        output.success('物品已给予')
                        break;
                    default:
                        playerData.openGUI();
                        output.success('');
                }
            }
            break;
            case 'get_nbt_stick':{
                const item=mc.newItem(Config.nbt_stick_type,1)!;
                const nbt=item.getNbt();
                nbt.setTag('tag',new NbtCompound({
                    display:new NbtCompound({
                        Name:new NbtString('§r§l§dNBT修改工具'),
                        Lore:new NbtList([new NbtString('§r§f快速打开方块/实体的NBT面板')])
                    }),
                    nbt_stick:new NbtByte(1),
                    ench:new NbtList([])
                }))
                item.setNbt(nbt);
                if(player.getInventory().addItem(item)){
                    player.refreshItems();
                    output.success('给予成功');
                }
                else output.error('给予失败');
            }
        }
    }
    const cmd=mc.newCommand('nbt','NBT工具 by bluebox',PermType.GameMasters);
    cmd.setEnum('e_item',['item']);
    cmd.setEnum('e_block',['block']);
    cmd.setEnum('e_entity',['entity']);
    cmd.setEnum('e_getNbtStick',['get_nbt_stick']);
    cmd.setEnum('e_collection',['collection']);
    cmd.setEnum('e_reload',['reload']);
    cmd.setEnum('ec_item',['item']);
    cmd.setEnum('ec_block',['block']);
    cmd.setEnum('ec_entity',['entity']);

    cmd.mandatory('rootEnum',ParamType.Enum,'e_item');
    cmd.mandatory('rootEnum',ParamType.Enum,'e_block');
    cmd.mandatory('rootEnum',ParamType.Enum,'e_entity');
    cmd.mandatory('rootEnum',ParamType.Enum,'e_getNbtStick');
    cmd.mandatory('rootEnum',ParamType.Enum,'e_reload');
    cmd.mandatory('rootEnum',ParamType.Enum,'e_collection');
    cmd.mandatory('collectionEnum',ParamType.Enum,'ec_item');
    cmd.mandatory('collectionEnum',ParamType.Enum,'ec_block');
    cmd.mandatory('collectionEnum',ParamType.Enum,'ec_entity');

    cmd.mandatory('collectionItemName',ParamType.String);
    cmd.mandatory('collectionBlockName',ParamType.String);
    cmd.mandatory('collectionEntityName',ParamType.String);

    cmd.mandatory('blockPos',ParamType.BlockPos);
    cmd.mandatory('pos',ParamType.Vec3);
    cmd.mandatory('entity',ParamType.Actor);
    cmd.mandatory('player',ParamType.Player);
    cmd.setCallback(callback);
    cmd.overload(['e_item']);
    cmd.overload(['e_block','blockPos']);
    cmd.overload(['e_entity','entity']);
    cmd.overload(['e_collection']);
    cmd.overload(['e_collection','ec_item','collectionItemName','player']);
    cmd.overload(['e_collection','ec_block','collectionBlockName','blockPos']);
    cmd.overload(['e_collection','ec_entity','collectionEntityName','pos']);
    cmd.overload(['e_getNbtStick'])
    cmd.overload(['e_reload']);
    cmd.setup();
    }
    
    colorLog('green','NBT工具插件已启用 -- bluebox');
})

mc.listen('onUseItemOn',(player,item,block,size,pos)=>{
    const playerData=PlayerData.get(player)!;
    try{
        if((player.getHand().getNbt() as any).getTag('tag').getData('nbt_stick')==1){
            if(playerData.useBlock==0){
                playerData.useBlock=5;
                const id=setInterval(()=>{
                    if(playerData.useBlock>0) playerData.useBlock--;
                    else clearInterval(id!);
                },200);
                Station.GUIforBlock(block,()=>{
                    player.tell('修改成功');
                }).send(player);
            }
            else{
                playerData.useBlock=5;
            }
            return false;
        }
    }catch(e){}
})

mc.listen('onAttackEntity',(player,entity,damage)=>{
    try{
        if((player.getHand().getNbt() as any).getTag('tag').getData('nbt_stick')==1){
            Station.GUIforEntity(entity,()=>{
                entity.refreshItems();
                player.tell('修改成功');
            }).send(player);
            return false;
        }
    }catch(e){}
})

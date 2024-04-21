import { CustomPanel } from "../../Form/CustomForm/CustomPanel";
import { DropDown } from "../../Form/CustomForm/DropDown";
import { Input } from "../../Form/CustomForm/Input";
import { Switch } from "../../Form/CustomForm/Switch";
import { Panel } from "../../Form/Panel";
import { ButtonData } from "../../Form/SimpleForm/ButtonData";
import { ButtonPanel } from "../../Form/SimpleForm/ButtonPanel";
import { PlayerData } from "../Data/PlayerData";
import { LinkedNbt } from "../Structure/LinkedNbt";
import { Searcher } from "../Structure/Searcher";
import { Util } from "../Util/Util";

export class Station{
    public static readonly tools:((event:{nbt:LinkedNbt,data:PlayerData,action:(root:LinkedNbt)=>void,open:()=>void})=>ButtonData|undefined)[]=[];
    public static errorGUI(player:Player,rawPanel:Panel,message:string){
        player.sendModalForm('错误',message,'重新编辑','不保存并退出编辑',(player,result)=>{
            if(result) rawPanel.send(player);
            else player.tell('已退出');
        })
    }
    public static GUIforEntity(entity:Entity,action=()=>{}){
        const fm=new ButtonPanel('实体:'+entity.name);
        fm.add(new ButtonData('NBT',(player)=>{
            const nbt=entity.getNbt();
            this.GUIforNBT(new LinkedNbt(nbt),(root)=>{
                entity.setNbt(root.getNbt());
                action();
            }).send(player);
        }));
        fm.add(new ButtonData('收藏此生物',(player,index,panel)=>{
            const playerData=PlayerData.get(player)!;
            panel.open(player,playerData.savedEntity.GUIforAdd(Util.toSNBT(entity.getNbt()),(name)=>{
                if(name==null){
                    panel.send(player);
                }
                else{
                    player.tell('收藏成功');
                    playerData.save();
                }
            }));
        }))
        return fm;
    }
    public static GUIforBlock(block:Block,action=()=>{}){
        const fm=new ButtonPanel('方块:'+block.name);
        fm.add(new ButtonData('NBT',(player)=>{
            const nbt=Util.blockToNbt(block);
            this.GUIforNBT(new LinkedNbt(nbt),(root)=>{
                Util.nbtToBlock(root.getNbt(),block.pos);
                action();
            }).send(player);
        }));
        fm.add(new ButtonData('收藏此方块',(player,index,panel)=>{
            const playerData=PlayerData.get(player)!;
            panel.open(player,playerData.savedBlock.GUIforAdd(Util.toSNBT(Util.blockToNbt(block)),(name)=>{
                if(name==null){
                    panel.send(player);
                }
                else{
                    player.tell('收藏成功');
                    playerData.save();
                }
            }));
        }))
        return fm;
    }
    public static GUIforItem(item:Item,action=()=>{}){
        const fm=new ButtonPanel('物品:'+item.name);
        fm.add(new ButtonData('NBT',(player)=>{
            const nbt=item.getNbt();
            this.GUIforNBT(new LinkedNbt(nbt),(root)=>{
                item.setNbt(root.getNbt());
                action();
            }).send(player);
        }));
        fm.add(new ButtonData('收藏此物品',(player,index,panel)=>{
            const playerData=PlayerData.get(player)!;
            panel.open(player,playerData.savedItem.GUIforAdd(Util.toSNBT(item.getNbt()),(name)=>{
                if(name==null){
                    panel.send(player);
                }
                else{
                    player.tell('收藏成功');
                    playerData.save();
                }
            }));
        }))
        return fm;
    }
    public static GUIforNBT(root:LinkedNbt,action:(root:LinkedNbt)=>void){
        if(root.type==NBT.List||root.type==NBT.Compound){
            const fm=new ButtonPanel(root.path,root.strType);
            fm.add(new ButtonData('§l===工具箱===',(player,index,panel)=>{
                const fm=new ButtonPanel(root.path+'/工具箱');
                this.tools.forEach(tool=>{
                    const button=tool({nbt:root,data:PlayerData.get(player)!,action:action,open:()=>{this.GUIforNBT(root,action).send(player)}});
                    if(button!=undefined) fm.add(button);
                })
                panel.open(player,fm);
            }))
            fm.closeAction=(player)=>{
                if(root.prev==null) action(root);
                else this.GUIforNBT(root.prev,action).send(player);
            }
            root.forEach((nbt)=>{
                fm.add(new ButtonData(nbt.toString(),(player)=>{
                    this.GUIforNBT(nbt,action).send(player);
                }))
            })
            return fm;
        }
        else{
            const fm=new CustomPanel(root.path);
            fm.closeAction=(player)=>{
                if(root.prev==null) action(root);
                else this.GUIforNBT(root.prev,action).send(player);
            }
            const snbtInput=new Input('SNBT:','',root.snbt);
            const deleteSwitch=new Switch('删除此NBT:');
            fm.add(snbtInput);
            fm.add(deleteSwitch);
            fm.action=(player)=>{
                if(deleteSwitch.isSelected()) root.delete();
                else try{
                    root.setNbt(Util.parseSNBT(snbtInput.getValue()));
                    fm.closeAction(player,fm);
                } catch (e){
                    this.errorGUI(player,fm,e.message);
                }
            }
            return fm;
        }
    }
    static{
        this.tools.push((event)=>{
            return new ButtonData('搜索',(player,index,panel)=>{
                const fm=new CustomPanel(event.nbt.path+'/搜索');
                const searchMode=new DropDown('搜索模式',['SNBT值完全匹配','SNBT值局部匹配','区间(格式:数字~数字)','最大值(格式:数字)','最小值(格式:数字)','键匹配']);
                const onePageSwitch=new Switch('仅本页搜索');
                const input=new Input('搜索');
                fm.add(searchMode);
                fm.add(onePageSwitch);
                fm.add(input);
                fm.action=(player,panel)=>{
                    try{
                        let result:LinkedNbt[]=[];
                        switch(searchMode.getSelectedIndex()){
                            case 0:
                                result=Searcher.fullMatch(event.nbt,input.getValue(),onePageSwitch.isSelected());
                                break;
                            case 1:
                                result=Searcher.localMatch(event.nbt,input.getValue(),onePageSwitch.isSelected());
                                break;
                            case 2:
                                result=Searcher.intervalMatch(event.nbt,input.getValue(),onePageSwitch.isSelected());
                                break;
                            case 3:
                                result=Searcher.maxMatch(event.nbt,input.getValue(),onePageSwitch.isSelected());
                                break;
                            case 4:
                                result=Searcher.minMatch(event.nbt,input.getValue(),onePageSwitch.isSelected());
                                break;
                            case 5:
                                result=Searcher.keyMatch(event.nbt,input.getValue(),onePageSwitch.isSelected());
                                break;
                        }
                        const fm=new ButtonPanel(event.nbt.path+'/搜索结果');
                        result.forEach(nbt=>{
                            fm.add(new ButtonData('§1./'+nbt.prev!.path.substring(event.nbt.path.length)+' '+nbt.toString(),(player)=>{
                                this.GUIforNBT(nbt,event.action).send(player);
                            }))
                        })
                        panel.open(player,fm);
                    }catch(e){
                        this.errorGUI(player,panel,e.message);
                    }
                }
                panel.open(player,fm);
            })
        })
        this.tools.push((event)=>{
            if(event.nbt.type==NBT.Compound){
                return new ButtonData('添加SNBT',(player,index,panel,button)=>{
                    const fm=new CustomPanel(event.nbt.path+'/添加SNBT');
                    const keyInput=new Input('键(key):');
                    const valueInput=new Input('值(snbt):');
                    fm.add(keyInput);
                    fm.add(valueInput);
                    fm.action=(player,panel)=>{
                        try{
                            const nbt=Util.parseSNBT(valueInput.getValue());
                            const key=keyInput.getValue();
                            event.nbt.getNbt().setTag(key,nbt);
                            event.open();
                        }catch(e){
                            this.errorGUI(player,fm,e.message);
                        }
                    }
                    panel.open(player,fm);
                })
            }
            else if(event.nbt.type==NBT.List){
                return new ButtonData('添加SNBT',(player,index,panel,button)=>{
                    const fm=new CustomPanel(event.nbt.path+'/添加SNBT');
                    const addMode=new Switch('覆盖模式');
                    const keyInput=new Input('索引值(index):','',''+event.nbt.getNbt().getSize());
                    const valueInput=new Input('值(snbt):');
                    fm.add(addMode);
                    fm.add(keyInput);
                    fm.add(valueInput);
                    fm.action=(player,panel)=>{
                        try{
                            const nbt=Util.parseSNBT(valueInput.getValue());
                            const key=keyInput.getInt();
                            if(key==null) throw new Error('索引值应为整数');
                            else if(!addMode.isSelected()){
                                event.nbt.getNbt().setTag(key,nbt);
                            }
                            else if(key==event.nbt.getNbt().getSize()){
                                event.nbt.getNbt().addTag(nbt);
                            }
                            else{
                                event.nbt.getNbt().addTag(new NbtByte(0));
                                for(let i=event.nbt.getNbt().getSize()-1;i>key;i--){
                                    event.nbt.getNbt().setTag(i,event.nbt.getNbt().getTag(i-1));
                                }
                                event.nbt.getNbt().setTag(key,nbt);
                            }
                            event.open();
                        }catch(e){
                            this.errorGUI(player,fm,e.message);
                        }
                    }
                    panel.open(player,fm);
                })
            }
        })
        this.tools.push((event)=>{
            if(event.nbt.prev!=null)
            return new ButtonData('删除',(player)=>{
                event.nbt.delete();
                this.GUIforNBT(event.nbt.prev!,event.action).send(player);
            })
        })
        this.tools.push((event)=>{
            return new ButtonData('复制',()=>{
                event.data.clipboard=event.nbt.snbt;
                event.open();
            })
        })
        this.tools.push((event)=>{
            if(event.data.clipboard==undefined) return;
            return new ButtonData('粘贴',(player,index,panel)=>{
                if(event.nbt.type==NBT.List){
                    const fm=new CustomPanel(event.nbt.path+'/粘贴');
                    const addMode=new Switch('覆盖模式');
                    const keyInput=new Input('索引值(index):');
                    fm.add(addMode);
                    fm.add(keyInput);
                    fm.action=(player,panel)=>{
                        const nbt=Util.parseSNBT(event.data.clipboard!);
                        const key=keyInput.getInt();
                        if(key==null) throw new Error('索引值应为整数');
                        else if(!addMode.isSelected()){
                            event.nbt.getNbt().setTag(key,nbt);
                        }
                        else if(key==event.nbt.getNbt().getSize()){
                            event.nbt.getNbt().addTag(nbt);
                        }
                        else{
                            event.nbt.getNbt().addTag(new NbtByte(0));
                            for(let i=event.nbt.getNbt().getSize()-1;i>key;i--){
                                event.nbt.getNbt().setTag(i,event.nbt.getNbt().getTag(i-1));
                            }
                            event.nbt.getNbt().setTag(key,nbt);
                        }
                        event.open();
                    }
                    panel.open(player,fm);
                }
                else{
                    const fm=new CustomPanel(event.nbt.path+'/粘贴');
                    const keyInput=new Input('键值(key):');
                    fm.add(keyInput);
                    fm.action=()=>{
                        event.nbt.getNbt().setTag(keyInput.getValue(),Util.parseSNBT(event.data.clipboard!));
                        event.open();
                    }
                    panel.open(player,fm);
                }
            })
        })
        this.tools.push((event)=>{
            if(event.data.clipboard==undefined) return;
            return new ButtonData('覆盖',(player,index,panel)=>{
                event.nbt.setNbt(Util.parseSNBT(event.data.clipboard!));
                event.open();
            })
        })
        this.tools.push((event)=>{
            return new ButtonData('用收藏的SNBT覆盖',(player,index,panel)=>{
                panel.open(player,event.data.savedNbt.GUIforSelect((data)=>{
                    event.nbt.setNbt(Util.parseSNBT(data));
                    event.open();
                }));
            })
        })
        this.tools.push((event)=>{
            return new ButtonData('添加收藏的SNBT',(player,index,panel)=>{
                panel.open(player,event.data.savedNbt.GUIforSelect((data)=>{
                    if(event.nbt.type==NBT.List){
                        const fm=new CustomPanel(event.nbt.path+'/粘贴');
                        const addMode=new Switch('覆盖模式');
                        const keyInput=new Input('索引值(index):');
                        fm.add(addMode);
                        fm.add(keyInput);
                        fm.action=(player,panel)=>{
                            const nbt=Util.parseSNBT(data);
                            const key=keyInput.getInt();
                            if(key==null) throw new Error('索引值应为整数');
                            else if(!addMode.isSelected()){
                                event.nbt.getNbt().setTag(key,nbt);
                            }
                            else if(key==event.nbt.getNbt().getSize()){
                                event.nbt.getNbt().addTag(nbt);
                            }
                            else{
                                event.nbt.getNbt().addTag(new NbtByte(0));
                                for(let i=event.nbt.getNbt().getSize()-1;i>key;i--){
                                    event.nbt.getNbt().setTag(i,event.nbt.getNbt().getTag(i-1));
                                }
                                event.nbt.getNbt().setTag(key,nbt);
                            }
                            event.open();
                        }
                        panel.open(player,fm);
                    }
                    else{
                        const fm=new CustomPanel(event.nbt.path+'/粘贴');
                        const keyInput=new Input('键值(key):');
                        fm.add(keyInput);
                        fm.action=()=>{
                            event.nbt.getNbt().setTag(keyInput.getValue(),Util.parseSNBT(data));
                            event.open();
                        }
                        panel.open(player,fm);
                    }
                }));
            })
        })
        this.tools.push((event)=>{
            return new ButtonData('收藏此SNBT',(player,index,panel,button)=>{
                event.data.savedNbt.GUIforAdd(event.nbt.snbt,(name)=>{
                    if(name!=null){
                        event.data.save();
                        player.tell('收藏夹成功添加:'+name);
                    }
                    panel.send(player);
                }).send(player);
            })
        })
        this.tools.push((event)=>{
            return new ButtonData('保存并退出',()=>{
                event.action(event.nbt.root);
            })
        })
        this.tools.push((event)=>{
            return new ButtonData('不保存并退出',(player)=>{
                player.tell('已退出');
            })
        })
    }
}
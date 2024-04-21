import { CustomPanel } from "../../Form/CustomForm/CustomPanel";
import { Input } from "../../Form/CustomForm/Input";
import { Label } from "../../Form/CustomForm/Label";
import { Panel } from "../../Form/Panel";
import { ButtonData } from "../../Form/SimpleForm/ButtonData";
import { ButtonPanel } from "../../Form/SimpleForm/ButtonPanel";

export class DataMap{
    public constructor(title:string,suggestNameRoot='Unknow'){
        this.title=title;
        this.suggestNameRoot=suggestNameRoot;
    }
    public readonly map:Record<string,string>={};
    public title:string;
    public suggestNameRoot:string;
    public suggestName(name=this.suggestNameRoot){
        if(name==null){
            return this.suggestName(this.suggestNameRoot);
        }
        let i=0;
        while(this.has(name+(i==0?'':i))){
            i++;
        }
        return name+(i==0?'':i);
    }
    public set(name:string,data:string){
        this.map[name]=data;
    }
    public get(name:string):string|null{
        return this.map[name];
    }
    public delete(name:string){
        delete this.map[name];
    }
    public has(name:string){
        return this.map[name]!=null;
    }
    public GUIforManage(closeAction?:(player:Player,panel:Panel)=>void,addButtons?:(panel:ButtonPanel,key:string,data:string)=>void){
        const root=new ButtonPanel('管理:'+this.title);
        if(closeAction!=null) root.closeAction=closeAction;
        Object.keys(this.map).forEach(key=>{
            const value=this.map[key];
            root.add(new ButtonData(key,(player,index,panel)=>{
                const fm=new ButtonPanel('管理:'+this.title+'/'+key);
                fm.add(new ButtonData('查看数据',(player,index,panel)=>{
                    const fm=new CustomPanel('管理:'+this.title+'/'+key+'/查看数据');
                    fm.add(new Label(value));
                    fm.action=(player,panel)=>{
                        fm.back(player);
                    }
                    panel.open(player,fm);
                }))
                fm.add(new ButtonData('重命名',(player,index,panel)=>{
                    const fm=new CustomPanel('管理:'+this.title+'/'+key+'/重命名');
                    const nameInput=new Input('数据名字','',key);
                    fm.add(nameInput);
                    fm.action=(player,panel)=>{
                        const name=nameInput.getValue();
                        if(this.has(name)&&key!=name){
                            const fm=new ButtonPanel('命名重复','数据文件中已存在"'+name+'"');
                            const suggestName=this.suggestName(name);
                            fm.add(new ButtonData('覆盖文件',()=>{
                                this.delete(key);
                                this.set(name,value);
                                this.GUIforManage(closeAction,addButtons).send(player);
                            }));
                            fm.add(new ButtonData('命名为"'+suggestName+'"并保存',()=>{
                                this.delete(key);
                                this.set(suggestName,value);
                                this.GUIforManage(closeAction,addButtons).send(player);
                            }));
                            fm.add(new ButtonData('取消',(player,index,panel)=>{
                                panel.back(player);
                            }));
                            panel.open(player,fm);
                        }
                        else{
                            this.delete(key);
                            this.set(name,value);
                            this.GUIforManage(closeAction,addButtons).send(player);
                        }
                    }
                    panel.open(player,fm);
                }))
                fm.add(new ButtonData('删除',(player,index,panel)=>{
                    player.sendModalForm('提示','您确定要删除"'+key+'"?','删除','取消',(player,result)=>{
                        if(result){
                            this.delete(key);
                            this.GUIforManage(closeAction,addButtons).send(player);
                        }
                        else{
                            panel.back(player);
                        }
                    })
                }))
                if(addButtons!=null) addButtons(fm,key,value);
                panel.open(player,fm);
            }))
        })
        return root;
    }
    public GUIforAdd(data:string,closeAction=(name:string|null)=>{}){
        const fm=new CustomPanel('添加:'+this.title);
        const nameInput=new Input('数据名字','',this.suggestName());
        fm.add(nameInput);
        fm.action=(player,panel)=>{
            const name=nameInput.getValue();
            if(this.has(name)){
                const fm=new ButtonPanel('命名重复','数据文件中已存在"'+name+'"');
                const suggestName=this.suggestName(name);
                fm.add(new ButtonData('覆盖文件',()=>{
                    this.set(name,data);
                    closeAction(name);
                }));
                fm.add(new ButtonData('命名为"'+suggestName+'"并保存',()=>{
                    this.set(suggestName,data);
                    closeAction(suggestName);
                }));
                fm.add(new ButtonData('取消',(player,index,panel)=>{
                    panel.closeAction(player,panel);
                }));
                panel.open(player,fm);
            }
            else{
                this.set(name,data);
                closeAction(name);
            }
        }
        fm.closeAction=(player,panel)=>{
            closeAction(null);
        }
        return fm;
    }
    public GUIforSelect(selectAction:(data:string)=>void):ButtonPanel{
        const fm=new ButtonPanel('选择:'+this.title);
        Object.keys(this.map).forEach(key=>{
            const value=this.map[key];
            fm.add(new ButtonData(key,()=>{
                selectAction(value);
            }));
        })
        return fm;
    }
    public fromObject(obj:Record<string,string>){
        Object.keys(obj).forEach(key=>{
            this.map[key]=obj[key];
        })
    }
}
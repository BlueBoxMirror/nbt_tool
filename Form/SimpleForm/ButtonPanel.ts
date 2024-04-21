import { ButtonData } from "./ButtonData";
import { Panel } from "../Panel";

export class ButtonPanel extends Panel{z
    /**
     * 按钮面板GUI
     * @param title 标题
     * @param subtitle 副标题
     */
    public constructor(title="",subtitle=""){
        super();
        this.title=title;
        this.subtitle=subtitle;
    }
    protected buttons:Array<ButtonData>=[];
    /**
     * 标题
     */
    public title:string;
    /**
     * 副标题
     */
    public subtitle:string;
    /**
     * 添加一个按钮
     * @param button 按钮
     */
    public add(button:ButtonData){
        this.buttons.push(button);
    }
    /**
     * 删除一个按钮
     * @param key 按钮/索引值
     */
    public remove(key:ButtonData|number){
        if(key instanceof Number){
            this.buttons.splice(<number>key,1);
        }
        else if(key instanceof ButtonData){
            for(let i=this.buttons.length;i>=0;i--){
                if(key==this.buttons[i]){
                    this.buttons.splice(i,1);
                }
            }
        }
    }
    /**
     * 发送GUI
     * @param player 玩家
     */
    public send(player:Player){
        const fm=mc.newSimpleForm();
        fm.setTitle(this.title);
        fm.setContent(this.subtitle);
        this.buttons.forEach(button=>{
            fm.addButton(button.text,button.image);
        })
        player.sendForm(fm,(player,id)=>{
            if(id==null){
                this.closeAction(player,this);
            }
            else{
                this.buttons[id].action(player,id,this,this.buttons[id]);
            }
        });
    }
}
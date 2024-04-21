import { ButtonPanel } from "./ButtonPanel";

export class ButtonData{
    /**
     * 按钮
     * @param text 文本
     * @param action 点击动作
     * @param image 图标
     */
    public constructor(text:string="",action:(player:Player,index:Number,panel:ButtonPanel,button:ButtonData)=>void=(player,index,panel,button)=>{},image:string=""){
        this.text=text;
        this.action=action;
        this.image=image;
    }
    /**
     * 文本
     */
    public text:string;
    /**
     * 点击动作
     * @param player 玩家 
     * @param index 按钮索引值
     * @param panel 父面板
     * @param button 此按钮
     */
    public action:(player:Player,index:Number,panel:ButtonPanel,button:ButtonData)=>void=(player,index,panel,button)=>{};
    /**
     * 图标
     */
    public image:string;
}
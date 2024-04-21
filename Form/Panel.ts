

export abstract class Panel{
    /**
     * 标题
     */
    public title="";
    /**
     * 上一个GUI
     */
    public lastPanel:Panel;
    /**
     * 关闭动作
     * @param player 玩家 
     * @param panel 此面板
     */
    public closeAction:(player:Player,panel:Panel)=>void=(player,panel)=>{
        panel.back(player);
    };
    /**
     * 返回至上一个GUI
     * @param player 玩家
     * @returns 是否成功
     */
    public back(player:Player):boolean{
        if(this.lastPanel!=null){
            this.lastPanel.send(player)
            return true;
        }
        else{
            return false;
        }
    }
    /**
     * 发送GUI
     * @param player 玩家
     */
    public abstract send(player:Player):void;
    /**
     * 快速函数 将此GUI为上一个GUI，打开一个新的GUI
     * @param player 玩家
     * @param panel 下一个GUI
     */
    public open(player:Player,panel:Panel):void{
        panel.lastPanel=this;
        panel.send(player);
    }
}
import { IO } from "../Data/IO";
import { IParser } from "./IParser";
import { ParserDefault } from "./ParserDefalut";
import { ParserLL2 } from "./ParserLL2";
import { ParserLL3 } from "./ParserLL3";

export class Config{
    public static readonly names=['use_parser','saved_snbt_path','suggest_name','nbt_stick_type'];
    private static use_parser=3;
    public static readonly config_path='config/bluebox/nbt_tool/config.json';//配置文件路径
    public static saved_snbt_path='config/bluebox/nbt_tool/player_data/';
    public static suggest_name={
        snbt:'SNBT',
        entity:'实体',
        item:'物品',
        block:'方块',
    };
    public static nbt_stick_type='minecraft:blaze_rod'
    public static parser:IParser;
    public static load(){
        if(IO.exists(this.config_path)){
            const obj=JSON.parse(IO.readFrom(this.config_path)!);
            this.names.forEach(key=>{
                Config[key]=obj[key];
            })
        }
        else{
            const obj:Record<string,any>={};
            this.names.forEach(key=>{
                obj[key]=Config[key];
            })
            IO.writeTo(this.config_path,JSON.stringify(obj,null,2));
        }
        switch(this.use_parser){
            case 2:
                this.parser=new ParserLL2();
                break;
            case 3:
                this.parser=new ParserLL3();
                break;
            default:
                this.parser=new ParserDefault();
        }
    }
}
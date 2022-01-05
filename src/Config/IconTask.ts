import Coverter from "./Coverter"
import { KLJSON } from "./KLJSON"

export = class IconTask {

    /// 扫描路径
    inputs: string[] = []
    /// 忽略路径
    ignore: string[] = []
    /// 转换器配置
    coverters: Coverter[]

    constructor(json: KLJSON) {
        this.inputs = json.arrayValue("inputs").map(item => item.stringValue())
        this.ignore = json.arrayValue("ignore").map(item => item.stringValue())
        this.coverters = json.arrayValue("coverters").map(item => new Coverter(item))        
    }

}
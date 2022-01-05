import CoverterOutput from "./CoverterOutput"
import CoverterType from "./CoverterType"
import { KLJSON } from "./KLJSON"

export = class Coverter {
    /// 处理文件类型
    type: CoverterType
    /// 默认图片倍率
    icon_scale: number = 3
    /// 输出选项
    output: CoverterOutput

    constructor(json: KLJSON) {
        this.type = CoverterType.init(json.stringValue("type")) 
        this.icon_scale = json.numberValue("icon_scale", 3)
        this.output = new CoverterOutput(json.node("output"), this.type.rawValue, this.icon_scale)
    }
}
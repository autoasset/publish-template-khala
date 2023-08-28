import CoverterOutput from "./CoverterOutput"
import CoverterType from "./CoverterType"
import { KLJSON } from "./KLJSON"

export = class Coverter {
    /// 处理文件类型
    type: CoverterType
    /// 默认图片倍率
    icon_scale: number = 3
    /// 转化器名称
    name?: string
    /// 输出选项
    output: CoverterOutput
    /// 启用图片压缩的最低文件大小, 默认 0
    enable_compression_minimum_size: number = 0

    constructor(json: KLJSON) {
        this.type = CoverterType.init(json.stringValue("type")) 
        this.icon_scale = json.numberValue("icon_scale", 3)
        this.name = json.string('name')
        this.enable_compression_minimum_size = json.numberValue("enable_compression_minimum_size", 0)
        this.output = new CoverterOutput(json.node("output"), this.type.rawValue, this.icon_scale)
    }
}
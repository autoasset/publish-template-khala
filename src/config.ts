import * as config from "./config.json";
import path from "path";

function filePath(value: string): string {
    value = value.trim()
    if (!value) {
        return value
    } else {
        return path.resolve(value)
    }
}

class AndroidProductsBuildSettings {

    copy_2x_inputs: string[]
    copy_3x_inputs: string[]

    constructor() {
        this.copy_2x_inputs = config.products.android.build_settings.copy_2x_inputs.map((item) => filePath(item))
        this.copy_3x_inputs = config.products.android.build_settings.copy_3x_inputs.map((item) => filePath(item))
    }

}

class AndroidProducts {

    build_settings: AndroidProductsBuildSettings
    vector_template: string
    x2: string
    x3: string

    constructor() {
        this.vector_template = filePath(config.products.android.vector_template)
        this.x2 = filePath(config.products.android.x2)
        this.x3 = filePath(config.products.android.x3)
        this.build_settings = new AndroidProductsBuildSettings()
    }

}

class Products {

    ios: { vector_template: string, icon: string, gif: string, iconfont: string }
    android: AndroidProducts
    flutter: { iconfont: string }

    constructor() {

        this.ios = {
            vector_template: filePath(config.products.ios.vector_template),
            icon: filePath(config.products.ios.icon),
            gif: filePath(config.products.ios.gif),
            iconfont: filePath(config.products.ios.iconfont),
        }

        this.android = new AndroidProducts()

        this.flutter = {
            iconfont: filePath(config.products.flutter.iconfont)
        }
    }

}

class Outputs {

    gif2x: string
    gif3x: string
    icon2x: string
    icon3x: string
    other: string
    pdf: string
    svg: string
    svg2pdf: string
    svg2xml: string
    svg2iconfont: string
    custom_iconfont_family: string
    svg2custom_iconfont: string
    allPaths: string[]

    constructor() {
        this.gif2x = filePath(config.outputs.gif2x)
        this.gif3x = filePath(config.outputs.gif3x)
        this.icon2x = filePath(config.outputs.icon2x)
        this.icon3x = filePath(config.outputs.icon3x)
        this.other = filePath(config.outputs.other)
        this.pdf = filePath(config.outputs.pdf)
        this.svg = filePath(config.outputs.svg)
        this.svg2pdf = filePath(config.outputs.svg2pdf)
        this.svg2xml = filePath(config.outputs.svg2xml)
        this.svg2iconfont = filePath(config.outputs.svg2iconfont)

        this.svg2custom_iconfont = filePath(config.outputs.svg2custom_iconfont)
        this.custom_iconfont_family = config.outputs.custom_iconfont_family

        this.allPaths = [this.gif2x,
        this.gif3x,
        this.icon2x,
        this.icon3x,
        this.other,
        this.pdf,
        this.svg,
        this.svg2pdf,
        this.svg2xml,
        this.svg2iconfont,
        this.svg2custom_iconfont]
    }

}

class IconConfig {

    inputs: string[]
    exclude: string[]
    outputs: Outputs
    products: Products

    constructor(path: string) {
        this.inputs = config.inputs.map((item) => filePath(item))
        this.exclude = config.exclude.map((item) => filePath(item))
        this.outputs = new Outputs()
        this.products = new Products()
    }

}

export = IconConfig
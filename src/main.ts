import ProductsIterator from './ProductsIterator';
import FileIterator from './FileIterator';
import IconConfig from './config';
import IconIterator from './IconIterator';
import SVGIterator from "./SVGIterator";
import SVGFontIterator from "./SVGFontIterator";


(async () => {
    try {
        const config = new IconConfig('./config.json')

        const svgFontIterator = new SVGFontIterator(config)
        const svgIterator = new SVGIterator(config)
        const iconIterator = new IconIterator(config, [svgIterator, svgFontIterator])
        const fileIterator = new FileIterator(config, [iconIterator])

        await fileIterator.prepare()
        await fileIterator.run()
        await fileIterator.finish()

        const productsIterator = new ProductsIterator(config)
        await productsIterator.prepare()
        await productsIterator.run()
        await productsIterator.finish()
    } catch (error) {
        console.log(error)
    }
})();
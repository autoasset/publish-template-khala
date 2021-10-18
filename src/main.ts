import IconCoverter from './IconCoverter'
import SVGCoverter from "./SVGCoverter"
import ProductsCoverter from './ProductsCoverter';

(async () => {
    try {
        await IconCoverter.run(async (file, name) => {
           await SVGCoverter.run(SVGCoverter, file, name)
        });
        await SVGCoverter.finish(SVGCoverter)
        await ProductsCoverter.run()
    } catch (error) {
       console.log(error)
    }
})();
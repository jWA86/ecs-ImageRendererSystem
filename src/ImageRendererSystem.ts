import { ISystem, ComponentFactory, IComponent, IComponentFactory } from "componententitysystem";
import { ImageComponent } from "../src/ImageComponent";

export { ImageRendererSystem }
class ImageRendererSystem implements ISystem {
    constructor() { }
    process(factory: IComponentFactory<ImageComponent>, context: CanvasRenderingContext2D) {
        let f = factory.values;
        let l = factory.iterationLength;

        let sortedByZindex = this.sortByZindex(f, l);

        for (let i = 0; i < l; ++i) {
            let comp = f[sortedByZindex[i].index];
            if (comp.active) {
                this.execute(comp, context);
            }
        }
        context.setTransform(1, 0, 0, 1, 0, 0);
    };
    execute(c: ImageComponent, context: CanvasRenderingContext2D) {
        let imgCenterX = c.destSize[0] / 2;
        let imgCenterY = c.destSize[1] / 2;
        context.setTransform(1, 0, 0, 1, imgCenterX, imgCenterY);
        context.rotate(c.rotation);
        context.drawImage(
            c.image,
            c.sourcePosition[0],
            c.sourcePosition[1],
            c.sourceSize[0],
            c.sourceSize[1],
            c.destPosition[0] - imgCenterX,
            c.destPosition[1] - imgCenterY,
            c.destSize[0],
            c.destSize[1]);
    };


    /** Sort by z-index in ascending order 
     * 
     * Return index corresponding to the input array and their z-value 
     *
     * Use of insertion sort algorithm as zIndex won't change often from frame to frame
    */
    sortByZindex(input: ImageComponent[], length: number): { index: number, z: number }[] {
        let layers = [];
        layers.push({ index: 0, z: input[0].zIndex });
        for (let i = 1; i < length; ++i) {
            let tmp = { index: i, z: input[i].zIndex };
            for (var k = i - 1; k >= 0 && (layers[k].z > tmp.z); --k) {
                layers[k + 1] = layers[k];
            }
            layers[k + 1] = tmp;
        }
        return layers;
    }
};

import { ComponentFactory, IComponent, IComponentFactory, System } from "componententitysystem";
import { ImageComponent } from "../src/ImageComponent";

export { ImageRendererSystem };

class ImageRendererSystem extends System {
    // public static context;
    constructor(public context: CanvasRenderingContext2D) {
        super();
        // ImageRendererSystem.context = context;
    }
    public process(args?: any[]) {
        if (!args) {
            args = [this.context];
        } else {
            args.push(this.context);
        }
        super.process(args);
        this.context.setTransform(1, 0, 0, 1, 0, 0);
    }
    public execute(c: ImageComponent, context: CanvasRenderingContext2D) {
        const imgCenterX = c.destSize[0] / 2;
        const imgCenterY = c.destSize[1] / 2;
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
    }

    /** Sort by z-index in ascending order
     *
     * Return index corresponding to the input array and their z-value
     *
     * Use of insertion sort algorithm as zIndex won't change often from frame to frame
     */
    public sortByZindex(input: ImageComponent[], length: number): Array<{ index: number, z: number }> {
        const layers = [];
        layers.push({ index: 0, z: input[0].zIndex });
        for (let i = 1; i < length; ++i) {
            const tmp = { index: i, z: input[i].zIndex };
            let k = i - 1;
            for (k; k >= 0 && (layers[k].z > tmp.z); --k) {
                layers[k + 1] = layers[k];
            }
            layers[k + 1] = tmp;
        }
        return layers;
    }
}

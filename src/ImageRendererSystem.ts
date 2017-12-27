import { ComponentFactory, IComponent, IComponentFactory, System } from "componententitysystem";
import { ImageComponent } from "../src/ImageComponent";

export { ImageRendererSystem };

class ImageRendererSystem extends System {
    constructor(public context: CanvasRenderingContext2D) {super(); }
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

}

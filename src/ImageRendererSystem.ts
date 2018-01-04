import { ComponentFactory, IComponent, IComponentFactory, System } from "ecs-framework";
import { vec2 } from "gl-matrix";
import { ImageComponent } from "../src/ImageComponent";

export { ImageRendererSystem };

class ImageRendererSystem extends System {
    constructor(public context: CanvasRenderingContext2D) { super(); }
    public process(args?: any[]) {
        super.process(args);
        this.context.setTransform(1, 0, 0, 1, 0, 0);
    }
    public execute(imgC: { image: HTMLImageElement }, sourcePositionC: { sourcePosition: vec2 }, sourceSizeC: { sourceSize: vec2 }, destPositionC: { destPosition: vec2 }, destSizeC: { destSize: vec2 }, rotationC: { rotation: number }) {
        const imgCenterX = destSizeC.destSize[0] / 2;
        const imgCenterY = destSizeC.destSize[1] / 2;
        this.context.setTransform(1, 0, 0, 1, imgCenterX, imgCenterY);
        this.context.rotate(rotationC.rotation);
        this.context.drawImage(
            imgC.image,
            sourcePositionC.sourcePosition[0],
            sourcePositionC.sourcePosition[1],
            sourceSizeC.sourceSize[0],
            sourceSizeC.sourceSize[1],
            destPositionC.destPosition[0] - imgCenterX,
            destPositionC.destPosition[1] - imgCenterY,
            destSizeC.destSize[0],
            destSizeC.destSize[1]);
    }

}

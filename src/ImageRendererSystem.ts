import { interfaces, System } from "ecs-framework";
import { vec2 } from "gl-matrix";
import { ImageComponent } from "../src/ImageComponent";

export { IImageRendererSystemParams, ImageRendererSystem };

interface IImageRendererSystemParams {
    i: { image: HTMLImageElement }; // replace by an index to pool of asset ?
    sourceP: { sourcePosition: vec2 };
    sourceS: { sourceSize: vec2 };
    destP: { destPosition: vec2 };
    destS: { destSize: vec2 };
    r: { rotation: number };
}

class ImageRendererSystem extends System<IImageRendererSystemParams> {
    protected _parameters: IImageRendererSystemParams = {
        destP: { destPosition: vec2.create() },
        destS: { destSize: vec2.create() },
        i: { image: new Image() },
        r: { rotation: 0 },
        sourceP: { sourcePosition: vec2.create() },
        sourceS: { sourceSize: vec2.create() },

    };
    constructor(public context: CanvasRenderingContext2D) { super(); }
    public process(...args: any[]) {
        super.process(...args);
        this.context.setTransform(1, 0, 0, 1, 0, 0);
    }
    public execute(params: IImageRendererSystemParams) {
        const imgCenterX = params.destS.destSize[0] / 2;
        const imgCenterY = params.destS.destSize[1] / 2;
        this.context.setTransform(1, 0, 0, 1, imgCenterX, imgCenterY);
        this.context.rotate(params.r.rotation);
        this.context.drawImage(
            params.i.image,
            params.sourceP.sourcePosition[0],
            params.sourceP.sourcePosition[1],
            params.sourceS.sourceSize[0],
            params.sourceS.sourceSize[1],
            params.destP.destPosition[0] - imgCenterX,
            params.destP.destPosition[1] - imgCenterY,
            params.destS.destSize[0],
            params.destS.destSize[1]);
    }

}

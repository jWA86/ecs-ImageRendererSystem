import { System } from "ecs-framework";
import { vec2 } from "gl-matrix";

export { IImageRendererSystemParams, ImageRendererSystem };

interface IImageRendererSystemParams {
    image: HTMLImageElement; // replace by an index to pool of asset ?
    sourcePosition: vec2;
    sourceSize: vec2;
    destPosition: vec2;
    destSize: vec2;
    rotation: number;
}

class ImageRendererSystem extends System<IImageRendererSystemParams> {
    protected _defaultParameter: IImageRendererSystemParams = {
        destPosition: vec2.create(),
        destSize: vec2.create(),
        image: new Image(),
        rotation: 0,
        sourcePosition: vec2.create(),
        sourceSize: vec2.create(),

    };
    constructor(public context: CanvasRenderingContext2D) { super(); }
    public process(...args: any[]) {
        super.process(...args);
        this.context.setTransform(1, 0, 0, 1, 0, 0);
    }
    public execute(params: IImageRendererSystemParams) {
        const imgCenterX = params.destSize[this._k.destSize][0] / 2;
        const imgCenterY = params.destSize[this._k.destSize][1] / 2;
        this.context.setTransform(1, 0, 0, 1, imgCenterX, imgCenterY);
        this.context.rotate(params.rotation[this._k.rotation]);
        this.context.drawImage(
            params.image[this._k.image],
            params.sourcePosition[this._k.sourcePosition][0],
            params.sourcePosition[this._k.sourcePosition][1],
            params.sourceSize[this._k.sourceSize][0],
            params.sourceSize[this._k.sourceSize][1],
            params.destPosition[this._k.destPosition][0] - imgCenterX,
            params.destPosition[this._k.destPosition][1] - imgCenterY,
            params.destSize[this._k.destSize][0],
            params.destSize[this._k.destSize][1]);
    }

}

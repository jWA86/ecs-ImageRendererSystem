import { System } from "ecs-framework";
import { mat4, vec2, vec3 } from "gl-matrix";

export { IImageRendererSystemParams, ImageRendererSystem };

interface IImageRendererSystemParams {
    image: HTMLImageElement; // replace by an index to pool of asset ?
    center: vec3;
    /** Dimension from the center */
    dimension: vec3;
    /** Coordinate of the top left corner of the image in the image atlas */
    sourcePosition: vec2;
    /** Size in the image atlas */
    sourceSize: vec2;
    transformation: mat4;
    // rendering image on HTML5Canvas requiere to draw images in the correct order, so they need to be sorted beforehand
    zIndex: number;
}

class ImageRendererSystem extends System<IImageRendererSystemParams> {
    protected _defaultParameter: IImageRendererSystemParams = {
        center: vec3.create(),
        dimension: vec3.create(),
        image: new Image(),
        sourcePosition: vec2.create(),
        sourceSize: vec2.create(),
        transformation: mat4.create(),
        zIndex: 1,

    };
    constructor(public context: CanvasRenderingContext2D) { super(); }
    public process(...args: any[]) {
        super.process(...args);
        this.context.setTransform(1, 0, 0, 1, 0, 0);
    }
    public execute(params: IImageRendererSystemParams) {
        // // a	m11 : glM : m00 [0]
        // // b	m12 : glM : m01 [1]
        // // c	m21 : glM : m10 [4]
        // // d	m22 : glM : m11 [5]
        // // e	m41 : glM : m30 [12]
        // // f	m42 : glM : m31 [13]
        const t = params.transformation[this._k.transformation];
        this.context.setTransform(t[0], t[1], t[4], t[5], t[12], t[13]);

        this.context.drawImage(params.image[this._k.image],
            params.sourcePosition[this._k.sourcePosition][0],
            params.sourcePosition[this._k.sourcePosition][1],
            params.sourceSize[this._k.sourceSize][0],
            params.sourceSize[this._k.sourceSize][1],
            0,
            0,
            params.sourceSize[this._k.sourceSize][0],
            params.sourceSize[this._k.sourceSize][1]);
    }

}

/// <reference types="gl-matrix" />
import { System } from "ecs-framework";
import { mat4, vec2, vec3 } from "gl-matrix";
export { IImageRendererSystemParams, ImageRendererSystem };
interface IImageRendererSystemParams {
    image: HTMLImageElement;
    center: vec3;
    /** Dimension from the center */
    dimension: vec3;
    /** Coordinate of the top left corner of the image in the image atlas */
    sourcePosition: vec2;
    /** Size in the image atlas */
    sourceSize: vec2;
    transformation: mat4;
    zIndex: number;
}
declare class ImageRendererSystem extends System<IImageRendererSystemParams> {
    context: CanvasRenderingContext2D;
    protected _defaultParameter: IImageRendererSystemParams;
    constructor(context: CanvasRenderingContext2D);
    process(...args: any[]): void;
    execute(params: IImageRendererSystemParams): void;
}

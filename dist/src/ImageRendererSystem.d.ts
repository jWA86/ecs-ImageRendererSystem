/// <reference types="gl-matrix" />
import { System } from "ecs-framework";
import { vec2 } from "gl-matrix";
export { IImageRendererSystemParams, ImageRendererSystem };
interface IImageRendererSystemParams {
    image: HTMLImageElement;
    sourcePosition: vec2;
    sourceSize: vec2;
    destPosition: vec2;
    destSize: vec2;
    rotation: number;
}
declare class ImageRendererSystem extends System<IImageRendererSystemParams> {
    context: CanvasRenderingContext2D;
    protected _defaultParameter: IImageRendererSystemParams;
    constructor(context: CanvasRenderingContext2D);
    process(...args: any[]): void;
    execute(params: IImageRendererSystemParams): void;
}

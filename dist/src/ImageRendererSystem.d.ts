/// <reference types="gl-matrix" />
import { System } from "ecs-framework";
import { vec2 } from "gl-matrix";
export { IImageRendererSystemParams, ImageRendererSystem };
interface IImageRendererSystemParams {
    i: {
        image: HTMLImageElement;
    };
    sourceP: {
        sourcePosition: vec2;
    };
    sourceS: {
        sourceSize: vec2;
    };
    destP: {
        destPosition: vec2;
    };
    destS: {
        destSize: vec2;
    };
    r: {
        rotation: number;
    };
}
declare class ImageRendererSystem extends System<IImageRendererSystemParams> {
    context: CanvasRenderingContext2D;
    protected _parameters: IImageRendererSystemParams;
    constructor(context: CanvasRenderingContext2D);
    process(...args: any[]): void;
    execute(params: IImageRendererSystemParams): void;
}

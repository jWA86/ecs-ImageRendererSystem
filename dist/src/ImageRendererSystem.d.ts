/// <reference types="gl-matrix" />
import { System } from "ecs-framework";
import { vec2 } from "gl-matrix";
export { ImageRendererSystem };
declare class ImageRendererSystem extends System {
    context: CanvasRenderingContext2D;
    constructor(context: CanvasRenderingContext2D);
    process(args?: any[]): void;
    execute(imgC: {
        image: HTMLImageElement;
    }, sourcePositionC: {
        sourcePosition: vec2;
    }, sourceSizeC: {
        sourceSize: vec2;
    }, destPositionC: {
        destPosition: vec2;
    }, destSizeC: {
        destSize: vec2;
    }, rotationC: {
        rotation: number;
    }): void;
}

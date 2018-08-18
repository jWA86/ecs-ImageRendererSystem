/// <reference types="gl-matrix" />
import { System } from "ecs-framework";
import { FastIterationMap } from "FastIterationMap";
import { mat4, vec2, vec3 } from "gl-matrix";
import { ImageAtlas } from "./asset";
export { IImageRendererSystemParams, ImageRendererSystem };
interface IImageRendererSystemParams {
    imageAtlasId: number;
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
    imgAtlasManager: FastIterationMap<number, ImageAtlas>;
    protected _defaultParameter: IImageRendererSystemParams;
    constructor(context: CanvasRenderingContext2D, imgAtlasManager: FastIterationMap<number, ImageAtlas>);
    process(...args: any[]): void;
    execute(params: IImageRendererSystemParams): void;
}

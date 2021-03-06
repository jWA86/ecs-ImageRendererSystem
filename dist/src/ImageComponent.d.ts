/// <reference types="gl-matrix" />
import { interfaces } from "ecs-framework";
import { mat4, vec2, vec3 } from "gl-matrix";
export { ImageComponent, IImageComponent };
interface IImageComponent extends ImageComponent {
    imageId: number;
    center: vec3;
    dimension: vec3;
    sourcePosition: vec2;
    sourceSize: vec2;
    transformation: mat4;
    zIndex: number;
}
declare class ImageComponent implements interfaces.IComponent, IImageComponent {
    imageId: number;
    dimension: vec3;
    sourcePosition: vec2;
    sourceSize: vec2;
    center: vec3;
    transformation: mat4;
    zIndex: number;
    entityId: number;
    active: boolean;
    constructor(imageId: number, dimension?: vec3, sourcePosition?: vec2, sourceSize?: vec2, center?: vec3, transformation?: mat4, zIndex?: number);
}

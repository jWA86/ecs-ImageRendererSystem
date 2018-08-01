/// <reference types="gl-matrix" />
import { interfaces } from "ecs-framework";
import { vec2 } from "gl-matrix";
export { ImageComponent };
declare class ImageComponent implements interfaces.IComponent {
    entityId: number;
    active: boolean;
    image: HTMLImageElement;
    sourcePosition: vec2;
    sourceSize: vec2;
    destPosition: vec2;
    destSize: vec2;
    rotation: number;
    zIndex: number;
    constructor(entityId: number, active: boolean, image: HTMLImageElement, sourcePosition: vec2, sourceSize: vec2, destPosition: vec2, destSize: vec2, rotation?: number, zIndex?: number);
}

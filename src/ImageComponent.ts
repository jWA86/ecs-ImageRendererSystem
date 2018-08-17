import { interfaces } from "ecs-framework";
import { mat4, vec2, vec3 } from "gl-matrix";

export { ImageComponent, IImageComponent };

interface IImageComponent extends ImageComponent {
    image: HTMLImageElement;
    center: vec3;
    dimension: vec3;
    sourcePosition: vec2;
    sourceSize: vec2;
    transformation: mat4;
    zIndex: number;
}

class ImageComponent implements interfaces.IComponent, IImageComponent {
    public entityId = 0;
    public active = true;

    constructor(public image: HTMLImageElement, public dimension: vec3 = vec3.create(), public sourcePosition: vec2 = vec2.create(), public sourceSize: vec2 = vec2.create(), public center: vec3 = vec3.create(), public transformation: mat4 = mat4.create(), public zIndex = 1) { }
}

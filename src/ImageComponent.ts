import { IComponent } from "ecs-framework";
import { vec2 } from "gl-matrix";
import { ImageAtlas } from "./asset";

export { ImageComponent };

interface IImageComponent extends ImageComponent {
    image: HTMLImageElement;
    sourcePosition: vec2;
    sourceSize: vec2;
    destPosition: vec2;
    destSize: vec2;
    rotation: number;
    zIndex: number;
}

class ImageComponent implements IComponent {
    constructor(public entityId: number, public active: boolean, public image: HTMLImageElement, public sourcePosition: vec2, public sourceSize: vec2, public destPosition: vec2, public destSize: vec2, public rotation: number = 0, public zIndex: number = 0) { }
}

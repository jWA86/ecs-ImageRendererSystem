import { IComponent } from "componententitysystem";
import { vec2 } from "gl-matrix";
import { ImageAtlas } from "./asset";

export { ImageComponent };

class ImageComponent implements IComponent {
    constructor(public entityId: number, public active: boolean, public image: HTMLImageElement, public sourcePosition: vec2, public sourceSize: vec2, public destPosition: vec2, public destSize: vec2, public zIndex: number = 0, public rotation: number = 0) { }
}

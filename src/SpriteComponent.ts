import { IComponent } from "componententitysystem";
import { SpriteMap } from "./asset";
import { vec2 } from "gl-matrix";


export {SpriteComponent};

class SpriteComponent implements IComponent {
 
    constructor(public entityId:number, public active:boolean,
         public sourceMap: HTMLImageElement,
          public sourcePosition:vec2,
          public sourceSize:vec2, 
            public destSize:vec2,
             public destPosition:vec2) {}
}
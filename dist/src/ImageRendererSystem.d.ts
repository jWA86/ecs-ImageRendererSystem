import { System } from "ecs-framework";
import { ImageComponent } from "../src/ImageComponent";
export { ImageRendererSystem };
declare class ImageRendererSystem extends System {
    context: CanvasRenderingContext2D;
    constructor(context: CanvasRenderingContext2D);
    process(args?: any[]): void;
    execute(c: ImageComponent, context: CanvasRenderingContext2D): void;
}

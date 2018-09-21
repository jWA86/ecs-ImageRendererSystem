import { interfaces } from "ecs-framework";
/** Resize the canvas when the client size change */
export declare class CanvasResizeSystem implements interfaces.ISystem<null> {
    canvas: HTMLCanvasElement;
    active: boolean;
    constructor(canvas: HTMLCanvasElement);
    process(): void;
    execute(): void;
    setParamSource(): void;
}

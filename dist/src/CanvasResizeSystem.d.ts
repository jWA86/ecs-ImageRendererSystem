import { System } from "ecs-framework";
/** Resize the canvas when the client size change */
export declare class CanvasResizeSystem extends System<{}> {
    canvas: HTMLCanvasElement;
    active: boolean;
    protected _defaultParameter: {};
    constructor(canvas: HTMLCanvasElement);
    process(): void;
    execute(): void;
}

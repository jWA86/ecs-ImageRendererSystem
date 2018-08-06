import { System } from "ecs-framework";
export declare class ClearCanvasSystem extends System<{}> {
    context: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    active: boolean;
    protected _defaultParameter: {};
    constructor(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement);
    process(): void;
    execute(): void;
}

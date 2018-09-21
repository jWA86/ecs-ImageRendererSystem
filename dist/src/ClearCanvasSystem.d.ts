import { interfaces } from "ecs-framework";
export declare class ClearCanvasSystem implements interfaces.ISystem<null> {
    context: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    active: boolean;
    protected _defaultParameter: {};
    constructor(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement);
    process(): void;
    execute(): void;
    setParamSource(): void;
}

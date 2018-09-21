import { interfaces } from "ecs-framework";

export class ClearCanvasSystem implements interfaces.ISystem<null> {
    public active: boolean = true;
    protected _defaultParameter = {};
    constructor(public context: CanvasRenderingContext2D, public canvas: HTMLCanvasElement) {}
    public process() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    public execute() {
        throw Error("method not use by this system");
     }
    public setParamSource() {
        throw Error("method not use by this system");
    }
}

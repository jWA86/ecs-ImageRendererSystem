import { System } from "ecs-framework";

export class ClearCanvasSystem extends System<{}> {
    public active: boolean = true;
    protected _defaultParameter = {};
    constructor(public context: CanvasRenderingContext2D, public canvas: HTMLCanvasElement) {
        super();
    }
    public process() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    public execute() { }
}

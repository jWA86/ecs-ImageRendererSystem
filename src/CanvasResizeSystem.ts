import { System } from "ecs-framework";

/** Resize the canvas when the client size change */
export class CanvasResizeSystem extends System<null> {
    public active: boolean = true;
    protected _defaultParameter = {};
    constructor(public canvas: HTMLCanvasElement) {
        super(null);
    }
    public process() {
        const canvas = this.canvas;

        const cssToRealPixels = window.devicePixelRatio || 1;

        const displayWidth  = Math.floor(canvas.clientWidth  * cssToRealPixels);
        const displayHeight = Math.floor(canvas.clientHeight * cssToRealPixels);

        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
        }
    }
    public execute() {}
}

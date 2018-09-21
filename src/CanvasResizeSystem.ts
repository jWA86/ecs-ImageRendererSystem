import { interfaces } from "ecs-framework";

/** Resize the canvas when the client size change */
export class CanvasResizeSystem implements interfaces.ISystem<null> {
    public active: boolean = true;
    constructor(public canvas: HTMLCanvasElement) {}
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
    public execute() {
        throw Error("method not use by this system");
    }
    public setParamSource() {
        throw Error("method not use by this system");
    }
}

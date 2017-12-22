import { ComponentFactory, IComponent, IComponentFactory, System } from "componententitysystem";
import { ImageComponent } from "../src/ImageComponent";

export { ImageRendererSystem };

// Sort system ou ComponentFactory have a sort method ?
// Si sort System comment indiquer le parametre de trie ?
// en passant le nom du param à la fonction process ?

class SortByIntSystem extends System {
    constructor(public paramName: string) { super(); }
    public process(args?: any[]) {
        const sortedIndex = this.sort(this.factories[0].values, this.factories[0].iterationLength, this.paramName);
    }
    public execute(c: {id: string, active: boolean, int: number}) {}
    /** Sort by z-index in ascending order
     *
     * Return index corresponding to the input array and their z-value
     *
     * Use of insertion sort algorithm as zIndex won't change often from frame to frame
     */
    public sort(input: IComponent[], length: number, paramToSort: string): Array<{ index: number, s: number }> {
        const sorted = [];
        sorted.push({ index: 0, s: input[0][paramToSort] });
        for (let i = 1; i < length; ++i) {
            const tmp = { index: i, s: input[i][paramToSort] };
            let k = i - 1;
            for (k; k >= 0 && (sorted[k].s > tmp.s); --k) {
                // swap in the pool instead
                sorted[k + 1] = sorted[k];
            }
            // swap in the pool instead
            sorted[k + 1] = tmp;
        }
        return sorted;
    }
}

class ImageRendererSystem extends System {
    constructor(public context: CanvasRenderingContext2D) {super(); }
    public process(args?: any[]) {
        if (!args) {
            args = [this.context];
        } else {
            args.push(this.context);
        }
        super.process(args);
        this.context.setTransform(1, 0, 0, 1, 0, 0);
    }
    public execute(c: ImageComponent, context: CanvasRenderingContext2D) {
        const imgCenterX = c.destSize[0] / 2;
        const imgCenterY = c.destSize[1] / 2;
        context.setTransform(1, 0, 0, 1, imgCenterX, imgCenterY);
        context.rotate(c.rotation);
        context.drawImage(
            c.image,
            c.sourcePosition[0],
            c.sourcePosition[1],
            c.sourceSize[0],
            c.sourceSize[1],
            c.destPosition[0] - imgCenterX,
            c.destPosition[1] - imgCenterY,
            c.destSize[0],
            c.destSize[1]);
    }

}

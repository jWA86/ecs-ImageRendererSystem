import { ComponentFactory, IComponent, IComponentFactory, System } from "componententitysystem";
import { ImageComponent } from "../src/ImageComponent";

export { ImageRendererSystem, InsertionSortSystem };

// Sort system ou ComponentFactory have a sort method ?
// Si sort System comment indiquer le parametre de trie ?
// en passant le nom du param à la fonction process ?

class InsertionSortSystem extends System {
    constructor(public paramName: string) { super(); }
    public process(args?: any[]) {
        const pool = this.factories[0];
        const sortedIndex = this.sort(pool.values, pool.iterationLength, this.paramName);
        const l = sortedIndex.length;
        for (let i = 0; i < sortedIndex.length; ++i) {
            const pId = pool.values[i].entityId;
            const sId = sortedIndex[i].id;
            if (sId !== pId) {
                pool.swap(pId, sId);
            }
        }
    }
    /* Not use as the sorting is done in the process method */
    public execute(c: {id: string, active: boolean, int: number}) {}
    /** Sort components in the pool by a number parameter
     *
     * Return an array of id and the value of the sorting parameter
     *
     * Use of insertion sort algorithm.
     */
    protected sort(input: IComponent[], length: number, paramToSort: string): Array<{ id: number, s: number }> {
        const sorted = [];
        sorted.push({ id: input[0].entityId, s: input[0][paramToSort] });
        for (let i = 1; i < length; ++i) {
            const tmp = { id: input[i].entityId, s: input[i][paramToSort] };
            let k = i - 1;
            for (k; k >= 0 && (sorted[k].s > tmp.s); --k) {
                sorted[k + 1] = sorted[k];
            }
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

import { ISystem, ComponentFactory, IComponent, IComponentFactory } from "componententitysystem";
import { SpriteComponent } from "../src/SpriteComponent";

export { SpriteRenderSystem }
// draw by order in the pool
class SpriteRenderSystem implements ISystem {
    constructor() { }
    process(factory: IComponentFactory<SpriteComponent>, context: CanvasRenderingContext2D) {
        let l = factory.size;
        let f = factory.values;
        for (let i = 0; i < l; ++i) {
            if (f[i].active) {
                this.execute(f[i], context);
            }
        }
        context.setTransform(1,0,0,1,0,0);
    };
    execute(c: SpriteComponent, context: CanvasRenderingContext2D) {
        // context.save();
        let imgCenterX = c.destSize[0]/2;
        let imgCenterY = c.destSize[1]/2 
        context.setTransform(1, 0, 0, 1, imgCenterX, imgCenterY);
        context.rotate(c.rotation);
        context.drawImage(
            c.spriteMap.image,
            c.sourcePosition[0],
            c.sourcePosition[1],
            c.sourceSize[0],
            c.sourceSize[1],
            c.destPosition[0] - imgCenterX,
            c.destPosition[1] - imgCenterY,
            c.destSize[0],
            c.destSize[1]);
    };
};

//other system with special rendering technique ? such as batch ?

import { ISystem, ComponentFactory, IComponent, IComponentFactory } from "componententitysystem";
import { SpriteComponent } from "../src/SpriteComponent";

export {SpriteRenderSystem}
// draw by order in the pool
class SpriteRenderSystem implements ISystem {
    constructor(){}
    process(factory: IComponentFactory<SpriteComponent>, context:Canvas2DContextAttributes){
        let l = factory.size;
        let f = factory.values;
        for (let i = 0; i < l; ++i) {
            if (f[i].active) {
                this.execute(f[i], context);
            }
        }
    };
    execute(c: SpriteComponent, context:Canvas2DContextAttributes){

    };
}

//other system with special rendering technique ? such as batch ?

import { IComponent } from "componententitysystem";

export {SpriteComponent};
class SpriteComponent implements IComponent {
    constructor(public entityId, public active){}
}
import "mocha";
import { expect } from "chai";
import { SpriteRenderSystem} from "../src/SpriteRenderSystem";
import {SpriteMap} from "../src/asset";
import {SpriteComponent} from "../src/SpriteComponent";
import { IComponent, IComponentFactory, ComponentFactory } from "componententitysystem";


describe("Image initialisation", () => {
    let imgUrl = "base/test/img/running.png";
    let grey = "base/test/img/grey.png";
    let descriptUrl = "base/test/img/running.json";

    let canvasId = "canvas";
    
    let spriteMap = new SpriteMap();
    beforeEach(() => {
        spriteMap = new SpriteMap();
        let mockHtml = ' <canvas id="canvas" width="800" height:"600"></canvas>';
        document.body.insertAdjacentHTML('afterbegin', mockHtml);
    });
           
    it("should allocate a new Image ellement at contruction", ()=> {
        expect(spriteMap.image).to.be.instanceOf(HTMLImageElement);
    });
    it("should be able to notify when the image is loaded", (done) => {
        spriteMap.loadImg(imgUrl).then((res) => {
            done();
        }).catch((res) => {
            console.log(spriteMap.image);
            done(new Error('failed to load'));
        });
    });
    it("should be able to notify when the image failed to load", (done) => {
        spriteMap.loadImg("nonExistingUrl.jpg").then((res) => {
            done(new Error('should failed to load but succeed'));
        }).catch((res) => {
            done();
        });
    });
    it("should be able to init a 2D context", () => {
        let canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvasId);
        let ctx = canvas.getContext("2d");
        expect(ctx).to.be.instanceOf(CanvasRenderingContext2D);
    }); 
    it("should be able to draw an image on the canvas", (done) => {
        let canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvasId);
        let ctx = canvas.getContext("2d");

        let data = ctx.getImageData(0, 0, 10, 10);
        // no image drawn = 0 value pixel
        for(let i = 0; i < data.data.length; ++i){
            expect(data.data[i]).to.be.equal(0);
        }
        
        spriteMap.loadImg(grey).then((res) => {
            ctx.drawImage(spriteMap.image, 0, 0);
            data = ctx.getImageData(0, 0, 10, 10);
            // if other value than 0 is found then the image is considered drawn
            for(let i = 0; i < data.data.length; ++i){
                if(data.data[i] !== 0) {
                    done();
                }
            }
            done("didn't find any other 0 pixel value");
        }).catch((res) => {
            done(new Error(res));
        })
    });
    describe("spriteMap descriptor", ()=>{
        // it("should be able to load a spriteMap descriptor from an url", (done) => {
    //     spriteMap.loadDescriptor(descriptUrl).then((res) => {
    //         expect(spriteMap.descriptor).to.be.instanceof(Object);
    //         done();
    //     }).catch((res) => {
    //         done("failed to load");
    //     });
    // });
    // it("should be able to parse and create sprite components from the spriteMap descriptor", () => {
    //     expect(false).to.equal(true);        
    // });
    });
    describe("sprite component", ()=>{
        it("should contain size, spriteMap reference and sprite position on the sprite map", () => {

        });
    });
    
    

});

describe("SpriteRenderSystem", () => {

it("should be able to draw a sprite component at given position", () => {

});
//     it("should be able to draw the sprite at given position on the canvas", () => {
//         expect(false).to.equal(true);
//     });
});
    
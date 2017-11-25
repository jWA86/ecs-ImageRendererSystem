import "mocha";
import { expect, assert } from "chai";
import { SpriteRenderSystem } from "../src/SpriteRenderSystem";
import { SpriteMap } from "../src/asset";
import { SpriteComponent } from "../src/SpriteComponent";
import { IComponent, IComponentFactory, ComponentFactory } from "componententitysystem";
import { vec2 } from "gl-matrix";

describe("imgRenderer", () => {
    let imgUrl = "base/test/img/ref.png";
    let grey = "base/test/img/grey.png";
    let descriptUrl = "base/test/img/running.json";

    let canvasId = "canvas";

    document.body.innerHTML = "";
    let mockHtml = '<canvas id="canvas" width="800" height="600"></canvas>';
    document.body.innerHTML = mockHtml;

    let spriteMap = new SpriteMap();
    beforeEach(() => {
        document.body.innerHTML = "";
        spriteMap = new SpriteMap();
        let mockHtml = '<canvas id="canvas" width="800" height="600"></canvas>';
        document.body.innerHTML = mockHtml;
    });

    describe("Image initialisation", () => {

        it("should allocate a new Image element at contruction", () => {
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
            let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvasId);
            let ctx = canvas.getContext("2d");
            expect(ctx).to.be.instanceOf(CanvasRenderingContext2D);
        });
        it("should be able to draw an image on the canvas", (done) => {
            let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvasId);
            let ctx = canvas.getContext("2d");

            let data = ctx.getImageData(0, 0, 10, 10);
            // no image drawn = 0 value pixel
            for (let i = 0; i < data.data.length; ++i) {
                expect(data.data[i]).to.be.equal(0);
            }

            spriteMap.loadImg(grey).then((res) => {
                ctx.drawImage(spriteMap.image, 0, 0);
                data = ctx.getImageData(0, 0, 10, 10);
                // if other value than 0 is found then the image is considered drawn
                for (let i = 0; i < data.data.length; ++i) {
                    if (data.data[i] !== 0) {
                        done();
                    }
                }
                done("didn't find any other 0 pixel value");
            }).catch((res) => {
                done(new Error(res));
            })
        });
        describe("spriteMap descriptor", () => {
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
        describe("sprite component", () => {
            it("should contain a reference to the spriteMap image, the source position, and source size", (done) => {
                let test = function () {
                    let spComponent = new SpriteComponent(1, true, spriteMap, vec2.fromValues(1, 1), vec2.fromValues(1, 1), vec2.fromValues(1, 1), vec2.fromValues(1, 1), 0);
                    expect(spComponent.spriteMap).to.be.instanceOf(SpriteMap);
                    expect(spComponent.sourcePosition[0]).to.equal(1);
                    expect(spComponent.sourcePosition[1]).to.equal(1);
                    expect(spComponent.sourceSize[0]).to.equal(1);
                    expect(spComponent.sourceSize[1]).to.equal(1);
                    expect(spComponent.destSize[0]).to.equal(1);
                    expect(spComponent.destSize[1]).to.equal(1);
                    expect(spComponent.destPosition[0]).to.equal(1);
                    expect(spComponent.destPosition[1]).to.equal(1);
                    done();
                }
                spriteMap.loadImg(imgUrl).then((res) => {
                    test();
                }).catch((res) => {
                    done(new Error(res));
                });
            });
        });
    });

    describe("SpriteRenderSystem", () => {
        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvasId);
        let ctx: CanvasRenderingContext2D = canvas.getContext("2d");

        let spriteFactory = new ComponentFactory<SpriteComponent>(5, SpriteComponent, new Image(), vec2.fromValues(0, 0), vec2.fromValues(0, 0), vec2.fromValues(0, 0), vec2.fromValues(0, 0));

        let imgRendererSystem = new SpriteRenderSystem();

        beforeEach(() => {
            canvas = <HTMLCanvasElement>document.getElementById(canvasId);
            ctx = canvas.getContext("2d");

            spriteFactory = new ComponentFactory<SpriteComponent>(5, SpriteComponent, new Image(), vec2.fromValues(0, 0), vec2.fromValues(0, 0), vec2.fromValues(0, 0), vec2.fromValues(0, 0));

            spriteMap.loadImg(imgUrl);
            let imgRendererSystem = new SpriteRenderSystem();
        });
        it("should be able to draw a sprite component at a given position", () => {
            //drawing at (100, 100)
            let posX = 100;
            let posY = 100;

            let comp = spriteFactory.create(1, true);
            comp.spriteMap = spriteMap;
            comp.sourcePosition = vec2.fromValues(0, 0);
            comp.sourceSize = vec2.fromValues(spriteMap.image.width, spriteMap.image.height);
            comp.destPosition = vec2.fromValues(posX, posY);
            comp.destSize = vec2.fromValues(spriteMap.image.width, spriteMap.image.height);

            imgRendererSystem.process(spriteFactory, ctx);

            // corner of the image should start at (poxX, posY)
            let topLeftCorner = ctx.getImageData(posX, posY, 1, 1);
            let topRightCorner = ctx.getImageData(spriteMap.image.width - 2 + posX, posY, 1, 1);
            let bottomRightCorner = ctx.getImageData(spriteMap.image.width - 2 + posX, spriteMap.image.height - 2 + posY, 1, 1);
            let bottomLeftCorner = ctx.getImageData(posX, spriteMap.image.height - 2 + posY, 1, 1);

            refImgPixelColorChecking(topLeftCorner, 255, 0, 0, 255);
            refImgPixelColorChecking(topRightCorner, 0, 255, 0, 255);
            refImgPixelColorChecking(bottomRightCorner, 0, 0, 255, 255);
            refImgPixelColorChecking(bottomLeftCorner, 255, 0, 255, 255);
        });
        it("should be able to draw part of the image", () => {
            let srcPosX = spriteMap.image.width - 25;
            let srcPosY = 0;
            let srcWidth = 25;
            let srcHeight = spriteMap.image.height;

            let comp = spriteFactory.create(1, true);
            comp.spriteMap = spriteMap;
            // draw only the last 25 pixel with of the image
            comp.sourcePosition = vec2.fromValues(srcPosX, srcPosY);
            comp.sourceSize = vec2.fromValues(srcWidth, srcHeight);
            comp.destPosition = vec2.fromValues(0, 0);
            comp.destSize = vec2.fromValues(srcWidth, srcHeight);

            imgRendererSystem.process(spriteFactory, ctx);

            // should have only top right corner and bottom right corner of the image drawn
            let topLeftCorner = ctx.getImageData(0, 0, 1, 1);
            let topRightCorner = ctx.getImageData(spriteMap.image.width - 1, 0, 1, 1);
            let bottomRightCorner = ctx.getImageData(spriteMap.image.width - 1, spriteMap.image.height - 1, 1, 1);
            let bottomLeftCorner = ctx.getImageData(0, spriteMap.image.height - 1, 1, 1);

            refImgPixelColorChecking(topLeftCorner, 0, 255, 0, 255);
            refImgPixelColorChecking(bottomLeftCorner, 0, 0, 255, 255);
            //checking that it doesn't draw the rop right and bottom right corner of the image
            refImgPixelColorChecking(topRightCorner, 0, 0, 0, 0);
            refImgPixelColorChecking(bottomRightCorner, 0, 0, 0, 0);
        });
        it("should be able to draw the image to a given size", () => {
            let destWidth = spriteMap.image.width * 0.5;
            let destHeight = spriteMap.image.height * 0.5;

            let comp = spriteFactory.create(1, true);
            comp.spriteMap = spriteMap;

            comp.sourcePosition = vec2.fromValues(0, 0);
            comp.sourceSize = vec2.fromValues(spriteMap.image.width, spriteMap.image.height);
            comp.destPosition = vec2.fromValues(0, 0);
            comp.destSize = vec2.fromValues(destWidth, destHeight);

            imgRendererSystem.process(spriteFactory, ctx);

            let topLeftCorner = ctx.getImageData(0, 0, 1, 1);
            let topRightCorner = ctx.getImageData(destWidth - 1, 0, 1, 1);
            let bottomRightCorner = ctx.getImageData(destWidth - 1, destHeight - 1, 1, 1);
            let bottomLeftCorner = ctx.getImageData(0, destHeight - 1, 1, 1);

            refImgPixelColorChecking(topLeftCorner, 255, 0, 0, 255);
            refImgPixelColorChecking(topRightCorner, 0, 255, 0, 255);
            refImgPixelColorChecking(bottomRightCorner, 0, 0, 255, 255);
            refImgPixelColorChecking(bottomLeftCorner, 255, 0, 255, 255);
        });
        it("should be able to rotate the image from its center by a given angle (radians) clockwise", () => {
            let rotation = 90 * Math.PI / 180;

            let comp = spriteFactory.create(1, true);
            comp.spriteMap = spriteMap;

            comp.sourcePosition = vec2.fromValues(0, 0);
            comp.sourceSize = vec2.fromValues(spriteMap.image.width, spriteMap.image.height);
            comp.destPosition = vec2.fromValues(0, 0);
            comp.destSize = vec2.fromValues(spriteMap.image.width, spriteMap.image.height);
            comp.rotation = rotation;

            imgRendererSystem.process(spriteFactory, ctx);

            let topLeftCorner = ctx.getImageData(3, 3, 1, 1);
            let topRightCorner = ctx.getImageData(spriteMap.image.width - 2, 0, 1, 1);
            let bottomRightCorner = ctx.getImageData(spriteMap.image.width - 2, spriteMap.image.height - 2, 1, 1);
            let bottomLeftCorner = ctx.getImageData(2, spriteMap.image.height - 2, 1, 1);

            // topleft should be purle
            // topright should be red
            // bottomright should green
            // bottomleft should be blue

            refImgPixelColorChecking(topLeftCorner, 255, 0, 255, 255);
            refImgPixelColorChecking(topRightCorner, 255, 0, 0, 255);
            refImgPixelColorChecking(bottomRightCorner, 0, 255, 0, 255);
            refImgPixelColorChecking(bottomLeftCorner, 0, 0, 255, 255);

        });
        // it("should be able to draw multiple images with their own rotation, size, position correctly", () => {

        // });
    });
});
//checking that the pixel is of the given color 
let refImgPixelColorChecking = function (pixel: ImageData, r: number, g: number, b: number, a: number) {
    expect(pixel.data[0]).to.equal(r);
    expect(pixel.data[1]).to.equal(g);
    expect(pixel.data[2]).to.equal(b);
    expect(pixel.data[3]).to.equal(a);
}

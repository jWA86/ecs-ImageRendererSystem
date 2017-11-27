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
            it("should contain a reference to the spriteMap image, the source position, source size, and z-index", (done) => {
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
                    expect(spComponent.zIndex).to.equal(0);
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

        let spriteFactory = new ComponentFactory<SpriteComponent>(5, SpriteComponent, new Image(), vec2.fromValues(0, 0), vec2.fromValues(0, 0), vec2.fromValues(0, 0), vec2.fromValues(0, 0), 5);

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
            // bottomright should be green
            // bottomleft should be blue

            refImgPixelColorChecking(topLeftCorner, 255, 0, 255, 255);
            refImgPixelColorChecking(topRightCorner, 255, 0, 0, 255);
            refImgPixelColorChecking(bottomRightCorner, 0, 255, 0, 255);
            refImgPixelColorChecking(bottomLeftCorner, 0, 0, 255, 255);

        });
        it("should be able to draw multiple images with their own rotation, size, and position correctly", () => {
            //components :
            // 1st comp : right part of the spriteMap rotate by 180 degree, so bleu is up and green is down, drawn at (0, 0)
            // 2nd comp : left corner (red) for the spriteMap translated to (100, 100)

            let comp1 = spriteFactory.create(1, true);
            comp1.spriteMap = spriteMap;
            comp1.sourcePosition = vec2.fromValues(spriteMap.image.width - 25, 0);
            comp1.sourceSize = vec2.fromValues(25, spriteMap.image.height);
            comp1.destPosition = vec2.fromValues(0, 0);
            comp1.destSize = vec2.fromValues(25, spriteMap.image.height);
            comp1.rotation = Math.PI; //180 degree 

            let comp2 = spriteFactory.create(2, true);
            comp2.spriteMap = spriteMap;
            comp2.sourcePosition = vec2.fromValues(0, 0);
            comp2.sourceSize = vec2.fromValues(25, 25);
            comp2.destPosition = vec2.fromValues(100, 100);
            comp2.destSize = vec2.fromValues(25, 25);

            imgRendererSystem.process(spriteFactory, ctx);

            let fistComponentTopPixel = ctx.getImageData(2, 2, 1, 1);
            expect(refImgPixelColorChecking(fistComponentTopPixel, 0, 0, 255, 255));

            let fistComponentBottomPixel = ctx.getImageData(2, comp1.spriteMap.image.height - 2, 1, 1);
            expect(refImgPixelColorChecking(fistComponentBottomPixel, 0, 255, 0, 255));

            let secondComponentPixel = ctx.getImageData(100 + 2, 100 + 2, 1, 1);
            expect(refImgPixelColorChecking(secondComponentPixel, 255, 0, 0, 255));

        });
        it("should be able to return a sorted list of index  ", () => {
            let c1 = spriteFactory.create(1, true);
            c1.zIndex = 3;
            let c2 = spriteFactory.create(2, true);
            c2.zIndex = 2;
            let c3 = spriteFactory.create(3, true);
            c3.zIndex = 1;
            let c4 = spriteFactory.create(4, true);
            c4.zIndex = 0;
            let arrayToSort = [c1, c2, c3, c4];
            //should give [3, 2, 1, 0]
            let sortedIndex = imgRendererSystem.sortByZindex(spriteFactory.values, spriteFactory.iterationLength);

            expect(sortedIndex[0].index).to.equal(3);
            expect(sortedIndex[1].index).to.equal(2);
            expect(sortedIndex[2].index).to.equal(1);
            expect(sortedIndex[3].index).to.equal(0);
        });
        it("should be able to draw images on top of each other based on the z index", () => {
            // draw in increasing order
            // red
            let comp1 = spriteFactory.create(1, true);
            comp1.spriteMap = spriteMap;
            comp1.sourcePosition = vec2.fromValues(0, 0);
            comp1.sourceSize = vec2.fromValues(25, 25);
            comp1.destPosition = vec2.fromValues(0, 0);
            comp1.destSize = vec2.fromValues(25, 25);
            comp1.zIndex = 0;

            // green
            let comp2 = spriteFactory.create(2, true);
            comp2.spriteMap = spriteMap;
            comp2.sourcePosition = vec2.fromValues(spriteMap.image.width - 25, 0);
            comp2.sourceSize = vec2.fromValues(25, 25);
            comp2.destPosition = vec2.fromValues(5, 5);
            comp2.destSize = vec2.fromValues(25, 25);
            comp2.zIndex = 3;
            // blue
            let comp3 = spriteFactory.create(3, true);
            comp3.spriteMap = spriteMap;
            comp3.sourcePosition = vec2.fromValues(spriteMap.image.width - 25, spriteMap.image.height - 25);
            comp3.sourceSize = vec2.fromValues(25, 25);
            comp3.destPosition = vec2.fromValues(10, 10);
            comp3.destSize = vec2.fromValues(25, 25);
            comp3.zIndex = 1;
            // purple
            let comp4 = spriteFactory.create(4, true);
            comp4.spriteMap = spriteMap;
            comp4.sourcePosition = vec2.fromValues(0, spriteMap.image.height - 25);
            comp4.sourceSize = vec2.fromValues(25, 25);
            comp4.destPosition = vec2.fromValues(15, 15);
            comp4.destSize = vec2.fromValues(25, 25);
            comp4.zIndex = 2;

            imgRendererSystem.process(spriteFactory, ctx);

            // should be red
            let p1 = ctx.getImageData(0, 0, 1, 1);
            expect(refImgPixelColorChecking(p1, 255, 0, 0, 255));
            // should be green
            let p2 = ctx.getImageData(10, 10, 1, 1);
            expect(refImgPixelColorChecking(p2, 0, 255, 0, 255));
            // should be green
            // bottom right corner minus a margin of 2
            let p3 = ctx.getImageData(25 + 5 - 2, 25 + 5 - 2, 1, 1);
            expect(refImgPixelColorChecking(p3, 0, 255, 0, 255));
            // should be purple
            let p4 = ctx.getImageData(25 + 10 - 2, 25 + 10 - 2, 1, 1);
            expect(refImgPixelColorChecking(p4, 255, 0, 255, 255));
        });
    });
});
//checking that the pixel is of the given color 
let refImgPixelColorChecking = function (pixel: ImageData, r: number, g: number, b: number, a: number) {
    expect(pixel.data[0]).to.equal(r);
    expect(pixel.data[1]).to.equal(g);
    expect(pixel.data[2]).to.equal(b);
    expect(pixel.data[3]).to.equal(a);
}

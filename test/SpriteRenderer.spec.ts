import "mocha";
import { expect, assert } from "chai";
import { SpriteRenderSystem } from "../src/SpriteRenderSystem";
import { SpriteMap } from "../src/asset";
import { SpriteComponent } from "../src/SpriteComponent";
import { IComponent, IComponentFactory, ComponentFactory } from "componententitysystem";
import { vec2 } from "gl-matrix";

describe("", () => {
    let imgUrl = "base/test/img/ref.png";
    let grey = "base/test/img/grey.png";
    let descriptUrl = "base/test/img/running.json";

    let canvasId = "canvas";

    let spriteMap = new SpriteMap();
    beforeEach(() => {
        document.body.innerHTML = "";
        spriteMap = new SpriteMap();
        let mockHtml = '<canvas id="canvas" width="800" height="600"></canvas>';
        document.body.innerHTML = mockHtml;
    });


    describe("Image initialisation", () => {

        it("should allocate a new Image ellement at contruction", () => {
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
                let test = function(){
                    let spComponent = new SpriteComponent(1, true, spriteMap.image, vec2.fromValues(1, 1), vec2.fromValues(1, 1), vec2.fromValues(1, 1), vec2.fromValues(1, 1));
                    expect(spComponent.image).to.be.instanceOf(HTMLImageElement);
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

        it("should be able to draw a sprite component at a given position", (done) => {
            let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvasId);
            let ctx = canvas.getContext("2d");

            let spriteFactory = new ComponentFactory<SpriteComponent>(5, SpriteComponent, new Image(), vec2.fromValues(0, 0), vec2.fromValues(0, 0), vec2.fromValues(0, 0), vec2.fromValues(0, 0));


            let imgRendererSystem = new SpriteRenderSystem();

            let test = function(spMap:SpriteMap){
                let comp = spriteFactory.create(1, true);
                comp.image = spMap.image;
                comp.sourcePosition = vec2.fromValues(0, 0);
                comp.sourceSize = vec2.fromValues(spMap.image.width, spMap.image.height);
                comp.destPosition = vec2.fromValues(0, 0);
                comp.destSize = vec2.fromValues(spMap.image.width, spMap.image.height);
                
                imgRendererSystem.process(spriteFactory, ctx);
                
                let topLeftCorner = ctx.getImageData(0, 0, 1, 1);
                let topRightCorner = ctx.getImageData(spMap.image.width - 2, 1, 1, 1);
                let bottomLeftCorner = ctx.getImageData(0, spMap.image.height - 2, 1, 1);
                let bottomRightCorner = ctx.getImageData(spMap.image.width - 2, spMap.image.height - 2, 1, 1);

                expect(topLeftCorner.data[0]).to.equal(255);
                expect(topLeftCorner.data[1]).to.equal(0);
                expect(topLeftCorner.data[2]).to.equal(0);
                expect(topLeftCorner.data[3]).to.equal(255);
                               
                expect(topRightCorner.data[0]).to.equal(255);
                expect(topRightCorner.data[1]).to.equal(0);
                expect(topRightCorner.data[2]).to.equal(0);
                expect(topRightCorner.data[3]).to.equal(255);

                expect(bottomLeftCorner.data[0]).to.equal(255);
                expect(bottomLeftCorner.data[1]).to.equal(0);
                expect(bottomLeftCorner.data[2]).to.equal(0);
                expect(bottomLeftCorner.data[3]).to.equal(255);

                expect(bottomRightCorner.data[0]).to.equal(255);
                expect(bottomRightCorner.data[1]).to.equal(0);
                expect(bottomRightCorner.data[2]).to.equal(0);
                expect(bottomRightCorner.data[3]).to.equal(255);
            }
            spriteMap.loadImg(imgUrl).then((res) => {
                test(spriteMap);
                done();
            }).catch((res) => {
                done(new Error(res));
            });
            
            // process by the renderer system
            // check if what is drawn correspond to the what it should be drawn, ex: checking pixel corners of the sprite
        });
             it("should be able to draw the sprite at given position on the canvas", () => {
                 expect(false).to.equal(true);
             });
    });
});
// HAVE A CLASS WHICH HANDLE CANVAS INITIALIZATION
// and provide the 2Dcontext
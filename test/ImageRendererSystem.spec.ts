import { assert, expect } from "chai";
import { ComponentFactory, IComponent, IComponentFactory } from "componententitysystem";
import { vec2 } from "gl-matrix";
import "mocha";
import { ImageAtlas } from "../src/asset";
import { ImageComponent } from "../src/ImageComponent";
import { ImageRendererSystem } from "../src/ImageRendererSystem";

describe("imgRenderer", () => {
    const imgUrl = "base/test/img/ref.png";
    const greyImgUrl = "base/test/img/grey.png";
    const transparentImgUrl = "base/test/img/transparent.png";
    const translucidImgUrl = "base/test/img/translucidRef.png";
    const descriptUrl = "base/test/img/running.json";

    const canvasId = "canvas";

    document.body.innerHTML = "";
    let mockHtml = '<canvas id="canvas" width="800" height="600"></canvas>';
    document.body.innerHTML = mockHtml;

    let imageAtlas = new ImageAtlas();
    beforeEach(() => {
        document.body.innerHTML = "";
        imageAtlas = new ImageAtlas();
        mockHtml = '<canvas id="canvas" width="800" height="600"></canvas>';
        document.body.innerHTML = mockHtml;
    });

    describe("Image initialisation", () => {

        it("should allocate a new Image element at contruction", () => {
            expect(imageAtlas.image).to.be.instanceOf(HTMLImageElement);
        });
        it("should be able to notify when the image is loaded", (done) => {
            imageAtlas.loadImg(imgUrl).then((res) => {
                done();
            }).catch((res) => {
                done(new Error("failed to load"));
            });
        });
        it("should be able to notify when the image failed to load", (done) => {
            imageAtlas.loadImg("nonExistingUrl.jpg").then((res) => {
                done(new Error("should failed to load but succeed"));
            }).catch((res) => {
                done();
            });
        });
        it("should be able to init a 2D context", () => {
            const canvas: HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
            const ctx = canvas.getContext("2d");
            expect(ctx).to.be.instanceOf(CanvasRenderingContext2D);
        });
        it("should be able to draw an image on the canvas", (done) => {
            const canvas: HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
            const ctx = canvas.getContext("2d");

            let data = ctx.getImageData(0, 0, 10, 10);
            // no image drawn = 0 value pixel
            for (let i = 0; i < data.data.length; ++i) {
                expect(data.data[i]).to.be.equal(0);
            }

            imageAtlas.loadImg(greyImgUrl).then((res) => {
                ctx.drawImage(imageAtlas.image, 0, 0);
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
            });
        });
        describe("ImageAtlas descriptor", () => {
            // it("should be able to load a ImageAtlas descriptor from an url", (done) => {
            //     ImageAtlas.loadDescriptor(descriptUrl).then((res) => {
            //         expect(ImageAtlas.descriptor).to.be.instanceof(Object);
            //         done();
            //     }).catch((res) => {
            //         done("failed to load");
            //     });
            // });
            // it("should be able to parse and create image components from the ImageAtlas descriptor", () => {
            //     expect(false).to.equal(true);
            // });
        });
        describe("image component", () => {
            it("should contain a reference to the image, the source position, source size, and z-index", (done) => {
                const test = (imgAtlas) => {
                    const spComponent = new ImageComponent(1, true, imgAtlas.image, vec2.fromValues(1, 1), vec2.fromValues(1, 1), vec2.fromValues(1, 1), vec2.fromValues(1, 1), 0);
                    expect(spComponent.image).to.be.instanceOf(HTMLImageElement);
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
                };
                imageAtlas.loadImg(imgUrl).then((res) => {
                    test(imageAtlas);
                }).catch((res) => {
                    done(new Error(res));
                });
            });
        });
    });

    describe("ImageRendererSystem", () => {
        let canvas: HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
        let ctx: CanvasRenderingContext2D = canvas.getContext("2d");

        let imgFactory = new ComponentFactory<ImageComponent>(5, ImageComponent, new Image(), vec2.fromValues(0, 0), vec2.fromValues(0, 0), vec2.fromValues(0, 0), vec2.fromValues(0, 0), 5);

        let imgRendererSystem = new ImageRendererSystem(ctx);

        beforeEach(() => {
            canvas = document.getElementById(canvasId) as HTMLCanvasElement;
            ctx = canvas.getContext("2d");

            imgFactory = new ComponentFactory<ImageComponent>(5, ImageComponent, new Image(), vec2.fromValues(0, 0), vec2.fromValues(0, 0), vec2.fromValues(0, 0), vec2.fromValues(0, 0));

            imageAtlas.loadImg(imgUrl);
            imgRendererSystem = new ImageRendererSystem(ctx);
        });
        it("should be able to draw a image component at a given position", () => {
            // Drawing at (100, 100)
            const posX = 100;
            const posY = 100;

            const comp = imgFactory.create(1, true);
            comp.image = imageAtlas.image;
            comp.sourcePosition = vec2.fromValues(0, 0);
            comp.sourceSize = vec2.fromValues(imageAtlas.image.width, imageAtlas.image.height);
            comp.destPosition = vec2.fromValues(posX, posY);
            comp.destSize = vec2.fromValues(imageAtlas.image.width, imageAtlas.image.height);

            imgRendererSystem.setFactories(imgFactory);
            imgRendererSystem.process();

            // corner of the image should start at (poxX, posY)
            const topLeftCorner = ctx.getImageData(posX, posY, 1, 1);
            const topRightCorner = ctx.getImageData(imageAtlas.image.width - 2 + posX, posY, 1, 1);
            const bottomRightCorner = ctx.getImageData(imageAtlas.image.width - 2 + posX, imageAtlas.image.height - 2 + posY, 1, 1);
            const bottomLeftCorner = ctx.getImageData(posX, imageAtlas.image.height - 2 + posY, 1, 1);

            refImgPixelColorChecking(topLeftCorner, 255, 0, 0, 255);
            refImgPixelColorChecking(topRightCorner, 0, 255, 0, 255);
            refImgPixelColorChecking(bottomRightCorner, 0, 0, 255, 255);
            refImgPixelColorChecking(bottomLeftCorner, 255, 0, 255, 255);
        });

        it("should be able to draw part of the image", () => {
            const srcPosX = imageAtlas.image.width - 25;
            const srcPosY = 0;
            const srcWidth = 25;
            const srcHeight = imageAtlas.image.height;

            const comp = imgFactory.create(1, true);
            comp.image = imageAtlas.image;
            // draw only the last 25 pixel with of the image
            comp.sourcePosition = vec2.fromValues(srcPosX, srcPosY);
            comp.sourceSize = vec2.fromValues(srcWidth, srcHeight);
            comp.destPosition = vec2.fromValues(0, 0);
            comp.destSize = vec2.fromValues(srcWidth, srcHeight);

            imgRendererSystem.setFactories(imgFactory);
            imgRendererSystem.process();

            // should have only top right corner and bottom right corner of the image drawn
            const topLeftCorner = ctx.getImageData(0, 0, 1, 1);
            const topRightCorner = ctx.getImageData(imageAtlas.image.width - 1, 0, 1, 1);
            const bottomRightCorner = ctx.getImageData(imageAtlas.image.width - 1, imageAtlas.image.height - 1, 1, 1);
            const bottomLeftCorner = ctx.getImageData(0, imageAtlas.image.height - 1, 1, 1);

            refImgPixelColorChecking(topLeftCorner, 0, 255, 0, 255);
            refImgPixelColorChecking(bottomLeftCorner, 0, 0, 255, 255);
            // checking that it doesn't draw the rop right and bottom right corner of the image
            refImgPixelColorChecking(topRightCorner, 0, 0, 0, 0);
            refImgPixelColorChecking(bottomRightCorner, 0, 0, 0, 0);
        });
        it("should be able to draw the image to a given size", () => {
            const destWidth = imageAtlas.image.width * 0.5;
            const destHeight = imageAtlas.image.height * 0.5;

            const comp = imgFactory.create(1, true);
            comp.image = imageAtlas.image;

            comp.sourcePosition = vec2.fromValues(0, 0);
            comp.sourceSize = vec2.fromValues(imageAtlas.image.width, imageAtlas.image.height);
            comp.destPosition = vec2.fromValues(0, 0);
            comp.destSize = vec2.fromValues(destWidth, destHeight);

            imgRendererSystem.setFactories(imgFactory);
            imgRendererSystem.process();

            const topLeftCorner = ctx.getImageData(0, 0, 1, 1);
            const topRightCorner = ctx.getImageData(destWidth - 1, 0, 1, 1);
            const bottomRightCorner = ctx.getImageData(destWidth - 1, destHeight - 1, 1, 1);
            const bottomLeftCorner = ctx.getImageData(0, destHeight - 1, 1, 1);

            refImgPixelColorChecking(topLeftCorner, 255, 0, 0, 255);
            refImgPixelColorChecking(topRightCorner, 0, 255, 0, 255);
            refImgPixelColorChecking(bottomRightCorner, 0, 0, 255, 255);
            refImgPixelColorChecking(bottomLeftCorner, 255, 0, 255, 255);
        });
        it("should be able to rotate the image from its center by a given angle (radians) clockwise", () => {
            const rotation = 90 * Math.PI / 180;

            const comp = imgFactory.create(1, true);
            comp.image = imageAtlas.image;

            comp.sourcePosition = vec2.fromValues(0, 0);
            comp.sourceSize = vec2.fromValues(imageAtlas.image.width, imageAtlas.image.height);
            comp.destPosition = vec2.fromValues(0, 0);
            comp.destSize = vec2.fromValues(imageAtlas.image.width, imageAtlas.image.height);
            comp.rotation = rotation;

            imgRendererSystem.setFactories(imgFactory);
            imgRendererSystem.process();

            const topLeftCorner = ctx.getImageData(3, 3, 1, 1);
            const topRightCorner = ctx.getImageData(imageAtlas.image.width - 2, 0, 1, 1);
            const bottomRightCorner = ctx.getImageData(imageAtlas.image.width - 2, imageAtlas.image.height - 2, 1, 1);
            const bottomLeftCorner = ctx.getImageData(2, imageAtlas.image.height - 2, 1, 1);

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
            // Components :
            // 1st comp : right part of the ImageAtlas rotate by 180 degree, so bleu is up and green is down, drawn at (0, 0)
            // 2nd comp : left corner (red) for the ImageAtlas translated to (100, 100)

            const comp1 = imgFactory.create(1, true);
            comp1.image = imageAtlas.image;
            comp1.sourcePosition = vec2.fromValues(imageAtlas.image.width - 25, 0);
            comp1.sourceSize = vec2.fromValues(25, imageAtlas.image.height);
            comp1.destPosition = vec2.fromValues(0, 0);
            comp1.destSize = vec2.fromValues(25, imageAtlas.image.height);
            comp1.rotation = Math.PI; // 180 degree

            const comp2 = imgFactory.create(2, true);
            comp2.image = imageAtlas.image;
            comp2.sourcePosition = vec2.fromValues(0, 0);
            comp2.sourceSize = vec2.fromValues(25, 25);
            comp2.destPosition = vec2.fromValues(100, 100);
            comp2.destSize = vec2.fromValues(25, 25);

            imgRendererSystem.setFactories(imgFactory);
            imgRendererSystem.process();

            const fistComponentTopPixel = ctx.getImageData(2, 2, 1, 1);
            expect(refImgPixelColorChecking(fistComponentTopPixel, 0, 0, 255, 255));

            const fistComponentBottomPixel = ctx.getImageData(2, comp1.image.height - 2, 1, 1);
            expect(refImgPixelColorChecking(fistComponentBottomPixel, 0, 255, 0, 255));

            const secondComponentPixel = ctx.getImageData(100 + 2, 100 + 2, 1, 1);
            expect(refImgPixelColorChecking(secondComponentPixel, 255, 0, 0, 255));

        });
        it("should be able to return a sorted list of index  ", () => {
            const c1 = imgFactory.create(1, true);
            c1.zIndex = 3;
            const c2 = imgFactory.create(2, true);
            c2.zIndex = 2;
            const c3 = imgFactory.create(3, true);
            c3.zIndex = 1;
            const c4 = imgFactory.create(4, true);
            c4.zIndex = 0;
            const arrayToSort = [c1, c2, c3, c4];
            // should give [3, 2, 1, 0]
            const sortedIndex = imgRendererSystem.sortByZindex(imgFactory.values, imgFactory.iterationLength);

            expect(sortedIndex[0].index).to.equal(3);
            expect(sortedIndex[1].index).to.equal(2);
            expect(sortedIndex[2].index).to.equal(1);
            expect(sortedIndex[3].index).to.equal(0);
        });
        it("should be able to draw images on top of each other based on the z index", () => {
            // draw in increasing order
            // red
            const comp1 = imgFactory.create(1, true);
            comp1.image = imageAtlas.image;
            comp1.sourcePosition = vec2.fromValues(0, 0);
            comp1.sourceSize = vec2.fromValues(25, 25);
            comp1.destPosition = vec2.fromValues(0, 0);
            comp1.destSize = vec2.fromValues(25, 25);
            comp1.zIndex = 0;

            // green
            const comp2 = imgFactory.create(2, true);
            comp2.image = imageAtlas.image;
            comp2.sourcePosition = vec2.fromValues(imageAtlas.image.width - 25, 0);
            comp2.sourceSize = vec2.fromValues(25, 25);
            comp2.destPosition = vec2.fromValues(5, 5);
            comp2.destSize = vec2.fromValues(25, 25);
            comp2.zIndex = 3;
            // blue
            const comp3 = imgFactory.create(3, true);
            comp3.image = imageAtlas.image;
            comp3.sourcePosition = vec2.fromValues(imageAtlas.image.width - 25, imageAtlas.image.height - 25);
            comp3.sourceSize = vec2.fromValues(25, 25);
            comp3.destPosition = vec2.fromValues(10, 10);
            comp3.destSize = vec2.fromValues(25, 25);
            comp3.zIndex = 1;
            // purple
            const comp4 = imgFactory.create(4, true);
            comp4.image = imageAtlas.image;
            comp4.sourcePosition = vec2.fromValues(0, imageAtlas.image.height - 25);
            comp4.sourceSize = vec2.fromValues(25, 25);
            comp4.destPosition = vec2.fromValues(15, 15);
            comp4.destSize = vec2.fromValues(25, 25);
            comp4.zIndex = 2;

            imgRendererSystem.setFactories(imgFactory);
            imgRendererSystem.process();

            // should be red
            const p1 = ctx.getImageData(0, 0, 1, 1);
            expect(refImgPixelColorChecking(p1, 255, 0, 0, 255));
            // should be green
            const p2 = ctx.getImageData(10, 10, 1, 1);
            expect(refImgPixelColorChecking(p2, 0, 255, 0, 255));
            // should be green
            // bottom right corner minus a margin of 2
            const p3 = ctx.getImageData(25 + 5 - 2, 25 + 5 - 2, 1, 1);
            expect(refImgPixelColorChecking(p3, 0, 255, 0, 255));
            // should be purple
            const p4 = ctx.getImageData(25 + 10 - 2, 25 + 10 - 2, 1, 1);
            expect(refImgPixelColorChecking(p4, 255, 0, 255, 255));
        });
        it("should be able to render transparent image", (done) => {
            // render a blue image behing in the transparent part of the top image
            // selected pixel should be blue
            const transparentHolder = new ImageAtlas();

            transparentHolder.loadImg(transparentImgUrl).then((res) => {
                const comp1 = imgFactory.create(1, true);
                comp1.image = imageAtlas.image;
                comp1.sourcePosition = vec2.fromValues(imageAtlas.image.width - 25, imageAtlas.image.width - 25);
                comp1.sourceSize = vec2.fromValues(25, 25);
                comp1.destPosition = vec2.fromValues(25, 25);
                comp1.destSize = vec2.fromValues(25, 25);
                comp1.zIndex = 0;

                const comp2 = imgFactory.create(2, true);
                comp2.image = transparentHolder.image;
                comp2.sourcePosition = vec2.fromValues(0, 0);
                comp2.sourceSize = vec2.fromValues(transparentHolder.image.width, transparentHolder.image.height);
                comp2.destPosition = vec2.fromValues(0, 0);
                comp2.destSize = vec2.fromValues(transparentHolder.image.width, transparentHolder.image.height);
                comp2.zIndex = 1;

                imgRendererSystem.setFactories(imgFactory);
                imgRendererSystem.process();

                // check that non transparent part is renderer
                const p1 = ctx.getImageData(1, 1, 1, 1);
                expect(refImgPixelColorChecking(p1, 255, 0, 0, 255));

                // check that at transparent zone of the image, the bottom image is visible
                // should be blue
                const p2 = ctx.getImageData(25 + 2, 25 + 2, 1, 1);
                expect(refImgPixelColorChecking(p2, 0, 0, 255, 255));
                done();

            }).catch((res) => {
                done(new Error(res));
            });
        });
        it("should be able to renderer translucid image", (done) => {
            const translucidHolder = new ImageAtlas();

            translucidHolder.loadImg(translucidImgUrl).then((res) => {
                const comp1 = imgFactory.create(1, true);
                comp1.image = imageAtlas.image;
                comp1.sourcePosition = vec2.fromValues(imageAtlas.image.width - 25, imageAtlas.image.width - 25);
                comp1.sourceSize = vec2.fromValues(25, 25);
                comp1.destPosition = vec2.fromValues(25, 25);
                comp1.destSize = vec2.fromValues(25, 25);
                comp1.zIndex = 0;

                const comp2 = imgFactory.create(2, true);
                comp2.image = translucidHolder.image;
                comp2.sourcePosition = vec2.fromValues(0, 0);
                comp2.sourceSize = vec2.fromValues(translucidHolder.image.width, translucidHolder.image.height);
                comp2.destPosition = vec2.fromValues(0, 0);
                comp2.destSize = vec2.fromValues(translucidHolder.image.width, translucidHolder.image.height);
                comp2.zIndex = 1;

                imgRendererSystem.setFactories(imgFactory);
                imgRendererSystem.process();

                // check that non transparent part is renderer
                const p1 = ctx.getImageData(1, 1, 1, 1);
                // red 50% opacity should give a pink 255, 0, 0, 128
                expect(refImgPixelColorChecking(p1, 255, 0, 0, 128));

                // check that at transparent zone of the image, the bottom image is visible
                // should be blue
                const p2 = ctx.getImageData(25 + 2, 25 + 2, 1, 1);
                // blue under a red 50% opacity should give 255-(255/2), 127-(255/2), 255-(255/2)
                expect(refImgPixelColorChecking(p2, 128, 0, 127, 255));
                done();
            }).catch((res) => {
                done(res);
            });
        });
    });
    // Checking that the pixel is of the given color
    const refImgPixelColorChecking = (pixel: ImageData, r: number, g: number, b: number, a: number) => {
        expect(pixel.data[0]).to.equal(r);
        expect(pixel.data[1]).to.equal(g);
        expect(pixel.data[2]).to.equal(b);
        expect(pixel.data[3]).to.equal(a);
    };
});
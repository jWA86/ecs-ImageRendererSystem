export { ImageAtlas };
declare class ImageAtlas {
    image: HTMLImageElement;
    constructor();
    loadImg(url: string): Promise<string>;
}

export { ImageAtlas };

class ImageAtlas {
    public image: HTMLImageElement;
    constructor() {
        this.image = new Image();
    }
    public loadImg(url: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.image = new Image();

            this.image.onload = () => {
                resolve(url);
            };

            this.image.onerror = () => {
                reject(url);
            };

            this.image.onabort = () => {
                reject(url);
            };

            this.image.src = url;
        });
    }

    // loadDescriptor(url:string):Promise<JSON> {

    // }
}

// Factory de ImageAtlas ?

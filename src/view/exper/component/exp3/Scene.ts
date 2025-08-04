import { useLoaderAssets } from "@/store/loadAssetsToBlob";

type Sprite = ImgSprite;

/**
 * 画板操作对象
 */
export class Scene {
    private loader = useLoaderAssets();
    private bgs: Array<Sprite> = [];
    private bgs_len: number;
    private player?: Sprite;
    private can_move = false;

    waitForReady() {
        return new Promise<void>((resolve) => {
            const checkReady = () => {
                if (this.isReady) {
                    resolve();
                } else {
                    // Check again on the next event loop cycle
                    setTimeout(checkReady, 0);
                }
            };
            // Start checking
            checkReady();
        });
    }
    get isFinish() {
        return !this.can_move;
    }
    get isReady() {
        return this.bgs.length == this.bgs_len && this.player != null;
    }
    constructor(bgs: Array<string>, player: string) {
        this.bgs_len = bgs.length;
        bgs.forEach((src, index) => {
            const url = this.loader.getAssets(src);
            this.loadImg(url).then((img) => {
                const sprite = new ImgSprite({
                    size: {
                        width: 128,
                        height: 128
                    },
                    pos: {
                        x: 0,
                        y: 0
                    }
                });
                sprite.instance = img;
                this.bgs[index] = sprite;
            });
        });

        this.loadImg(this.loader.getAssets(player)).then(img => {
            const resize = 10;
            const sprite = new ImgSprite({
                size: {
                    width: img.width / resize,
                    height: img.height / resize
                },
                pos: {
                    x: 0,
                    y: 0
                }
            });
            sprite.instance = img;
            this.player = sprite;
        });
    }

    /**
     * 重置sprite的位置
     * @param width 画板宽度
     * @param height 画板高度
     */
    reset(width: number, height: number) {
        if (!this.player) return;
        const unit = Math.min(width, height); // 获取最小的边框长度

        // 重设长度
        const { width: pw, height: ph } = this.player.size;
        this.player.size = {
            width: 0.15 * unit * (pw > ph ? pw / ph : 1),
            height: 0.15 * unit * (pw > ph ? 1 : ph / pw)
        }
        const padding = 50;
        this.bgs.forEach((item, index) => {
            const { width: bw, height: bh } = item.rsize;
            item.size = {
                width: 0.15 * unit * (bw > bh ? bw / bh : 1),
                height: 0.15 * unit * (bw > bh ? 1 : bh / bw)
            }

            switch (index) {
                case 0:
                    item.pos = {
                        x: 0 + padding,
                        y: 0 + padding
                    }
                    break;
                case 1:
                    item.pos = {
                        x: width - this.bgs[1].size.width - padding,
                        y: 0 + padding
                    }
                    break;
                case 2:
                    item.pos = {
                        x: 0 + padding,
                        y: height - this.bgs[2].size.height - padding
                    }
                    break;
                case 3:
                    item.pos = {
                        x: width - this.bgs[1].size.width - padding,
                        y: height - this.bgs[2].size.height - padding
                    }
                    break;
            }
        });

        this.player.pos = {
            x: width / 2 - this.player.size.width / 2,
            y: height - this.player.size.height - padding
        }

        this.can_move = true;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const { width, height } = ctx.canvas;
        ctx.clearRect(0, 0, width, height);
        this.bgs.forEach(bg => bg.draw(ctx));
        if (this.player) {
            this.player.draw(ctx);
        }
    }

    private loadImg(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    /**偏移值 */
    public dx = 0;
    /**偏移值 */
    public dy = 0;
    getValidFocusObj(x: number, y: number) {
        if (this.player && this.player.isFocus(x, y)) {
            this.dx = x - this.player.pos.x;
            this.dy = y - this.player.pos.y;
            return this.player;
        }
        return undefined;
    }
    moveValidObj(x: number, y: number) {
        if (!this.player || !this.can_move) return;
        this.player.pos = {
            x: x - this.dx,
            y: y - this.dy
        }
    }

    judge(x: number, y: number): Promise<number> {
        return new Promise((resolve) => {
            this.bgs.forEach((item, index) => {
                if (x > item.pos.x && x < item.pos.x + item.size.width && y > item.pos.y && y < item.pos.y + item.size.height) {
                    this.can_move = false;
                    resolve(index);
                }
            });
            resolve(-1);
        });
    }
}

export class ImgSprite {
    /**
     * dom图片实例
     */
    public instance: HTMLImageElement;
    /**
     * 绘制画板上的图片的宽高
     * @param width 大小是像素
     * @param height 大小是像素
     */
    public size: { width: number, height: number };
    /**
     * 绘制画板上的图片的坐标
     * @param x 大小是像素
     * @param y 大小是像素
     */
    public pos: { x: number, y: number };

    constructor(opts: {
        size: { width: number, height: number },
        pos: { x: number, y: number }
    }) {
        this.instance = document.createElement("img");
        this.size = opts.size;
        this.pos = opts.pos;
    }

    /**
     * 获取图片实例的宽高
     * 返回的是真实图片的大小，即像素
     */
    get rsize() {
        return {
            width: this.instance.width,
            height: this.instance.height
        }
    }
    set posX(x: number) { 
        this.pos.x = x;
    }
    set posY(y: number) { 
        this.pos.y = y;
    }
    
    draw(ctx: CanvasRenderingContext2D | undefined) {
        if (!ctx) return;
        ctx.drawImage(
            this.instance,
            0, 0, this.rsize.width, this.rsize.height,
            this.pos.x, this.pos.y, this.size.width, this.size.height
        );
    }

    isFocus(x: number, y: number) {
        return x > this.pos.x && x < this.pos.x + this.size.width && 
               y > this.pos.y && y < this.pos.y + this.size.height
    }
}
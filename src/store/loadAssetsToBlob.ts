import { defineStore } from "pinia";

type assetRecord = [string, string];
export const useLoaderAssets = defineStore("loader-assets-to-blobs", {
    state() {
        return {
            _running: false,
            tmpArr: new Array<assetRecord>(), // 用于存储准备加载的静态资源
            blobMap: new Map<string, string>(), // 用于存储最后的blob资源
            loading: 0, // 处于加载中的进度条
        }
    },
    getters: {
        isInit(): boolean { return !!this.blobMap.size },
        isRunning(): boolean { return this._running },
        isFinish(): boolean { return !this.tmpArr.length },
        progress(): {len: number, left: number, loading: number} {
            return {
                len: this.tmpArr.length + this.blobMap.size,
                left: this.tmpArr.length,
                loading: this.loading
            }
        }
    },
    actions: {
        _addAssetsToBlobAsync(url: string) {
            const _this = this;

            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            xhr.onload = function () {
                _this.loading -= 1;
                if (this.status == 200) {
                    const blob = this.response;
                    _this._loadSuccess(url, blob);
                } else {
                    _this._loadError(url, "Error");
                }
            }
            let c = 0;
            xhr.onprogress = (e) => {
                this.loading += (e.loaded - c) / e.total;
                c = e.loaded;
            }
            xhr.ontimeout = function() {
                _this._loadError(url, "Timeout!");
            }
            xhr.send();
        },
        _loadSuccess(url: string, blob: Blob) {
            this.tmpArr.map((v, i) => {
                if (v[1] === url) {
                    this.tmpArr.splice(i, 1);
                    this.blobMap.set(v[0], URL.createObjectURL(blob));
                }
            });
        },
        _loadError(url: string, e: string) {
            console.warn(`load Assets Error: ${e}, url: ${url}`);
        },
        addAssets(name: string, str: string) {
            this.tmpArr.push([name, str]);
        },
        removeAssets(str: string) {
            URL.revokeObjectURL(this.getAssets(str));
            this.tmpArr.forEach((v, i) => {
                if (v[1] === str) {
                    this.tmpArr.splice(i, 1);
                    this.blobMap.delete(v[0]);
                }
            });
        },
        getAssets(str: string) {
            const url = this.blobMap.get(str)
            return url ? url : "";
        },
        startLoad() {
            if(this.isRunning) {
                return 0;
            }
            this._running = true;

            this.tmpArr.forEach(v => {
                this._addAssetsToBlobAsync(v[1]);
            });

            this._running = false;
            return 1;
        }
    }
});
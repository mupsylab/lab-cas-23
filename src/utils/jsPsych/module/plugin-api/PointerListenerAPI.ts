// KeyboardListener.ts

import { JsPsych } from "../../jsPsych";

type PointerEventHandler = (event: PointerEvent, time: number) => void;

class PointerListenerAPI {
    private dom: HTMLElement = document.documentElement;
    private listeners: Set<PointerEventHandler> = new Set();

    constructor() {
        this.handlePointer = this.handlePointer.bind(this);
    }

    private handlePointer(e: PointerEvent) {
        const time = JsPsych.instance.currTime;
        for(const listener of this.listeners) {
            listener(e, time);
        }
    }
    public addListener(listener: PointerEventHandler) {
        this.listeners.add(listener);
    }
    public removeListener(listener: PointerEventHandler) {
        this.listeners.delete(listener);
    }
    public removeAllListener() {
        this.listeners.clear();
    }
    registerListener() {
        this.dom.addEventListener("pointerdown", this.handlePointer);
        this.dom.addEventListener("pointermove", this.handlePointer);
        this.dom.addEventListener("pointerleave", this.handlePointer);
    }
    destoryListener() {
        this.dom.removeEventListener("pointerdown", this.handlePointer);
        this.dom.removeEventListener("pointermove", this.handlePointer);
        this.dom.removeEventListener("pointerleave", this.handlePointer);
    }
}

export { PointerListenerAPI };

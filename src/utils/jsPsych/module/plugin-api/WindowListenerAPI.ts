// WindowListenerAPI.ts

import { JsPsych } from "../../jsPsych";

type WindowEventHandler = (event: Event, time: number) => void;

class WindowListenerAPI {
    private listeners: Set<WindowEventHandler> = new Set();

    constructor() {
        this.handleWindow = this.handleWindow.bind(this);
    }

    public addListener(listener: WindowEventHandler) {
        this.listeners.add(listener);
    }
    public removeListener(listener: WindowEventHandler) {
        this.listeners.delete(listener);
    }
    public removeAllListener() {
        this.listeners.clear();
    }

    private handleWindow(e: Event) {
        const time = JsPsych.instance.currTime;
        for(const listener of this.listeners) {
            listener(e, time);
        }
        e.preventDefault();
        e.stopPropagation();
    }
    registerListener() {
        window.addEventListener("resize", this.handleWindow);
        window.addEventListener("beforeunload", this.handleWindow);
        window.addEventListener("unload", this.handleWindow);
    }
    destoryListener() {
        window.removeEventListener("resize", this.handleWindow);
        window.removeEventListener("beforeunload", this.handleWindow);
        window.removeEventListener("unload", this.handleWindow);
    }
}

export { WindowListenerAPI };

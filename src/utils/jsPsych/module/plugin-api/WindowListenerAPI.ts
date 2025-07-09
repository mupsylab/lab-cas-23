// WindowListenerAPI.ts

import { h, render } from "vue";
import { JsPsych } from "../../jsPsych";
import RotaryPhone from "@/component/rotaryPhone.vue";

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

    public init() {
        this.resize({ type: "resize" } as any, 0);
    }
    private resize(e: Event, _: number) {
        if (e.type !== "resize") return;
        const { innerWidth, innerHeight } = window;
        if (innerWidth > innerHeight && JsPsych.opts.forceDirection === "v") {
            JsPsych.instance.pause();
            render(h(RotaryPhone), JsPsych.instance.currTrial.parent.getDisplayDom());
        }
        else if (innerWidth < innerHeight && JsPsych.opts.forceDirection === "h") {
            JsPsych.instance.pause();
            render(h(RotaryPhone), JsPsych.instance.currTrial.parent.getDisplayDom());
        }
        else {
            JsPsych.instance.resume();
        }
    }
    private handleWindow(e: Event) {
        const time = JsPsych.instance.currTime;
        for (const listener of this.listeners) {
            listener(e, time);
        }
        if (JsPsych.opts.toastClose) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
    registerListener() {
        window.addEventListener("resize", this.handleWindow);
        window.addEventListener("beforeunload", this.handleWindow);
        window.addEventListener("unload", this.handleWindow);
        this.addListener(this.resize);
    }
    destoryListener() {
        window.removeEventListener("resize", this.handleWindow);
        window.removeEventListener("beforeunload", this.handleWindow);
        window.removeEventListener("unload", this.handleWindow);
    }
}

export { WindowListenerAPI };

import { Data } from "./module/data";
import { KeyboardListenerAPI, TimerAPI, PointerListenerAPI, WindowListenerAPI } from "./module/plugin-api";
import { TimelineArray, TimelineDescription } from "./timeline";
import { Timeline } from "./timeline/Timeline";
import * as utils from "./module/utils";
import * as random from "./module/randomization";

interface JsPsychOptions {
    /**
     * 语言环境，默认浏览器语言
     */
    locale?: string;
    /**
     * 强制显示器的方向，默认无
     */
    forceDirection?: "h" | "v";
    /**
     * 试次间隔时间，默认0
     */
    iti?: number;
    /**
     * 刷新浏览器的时候是否显示提示框
     */
    toastClose?: boolean;
}

export class JsPsych {
    private static only_instance: JsPsych | undefined;
    public static opts: JsPsychOptions = {
        toastClose: true
    };
    public static plugin = {
        timer: new TimerAPI(),
        keyboard: new KeyboardListenerAPI(),
        pointer: new PointerListenerAPI(),
        window: new WindowListenerAPI(),
        utils, random
    };
    private timeline: Timeline;
    public data: Data = new Data();

    constructor() {
        this.data.reset();
        this.timeline = new Timeline([], document.documentElement);
    }
    load(timeline: TimelineDescription | TimelineArray, dom: HTMLElement) {
        this.timeline = new Timeline(timeline, dom);

        JsPsych.plugin.keyboard.registerListener();
        JsPsych.plugin.pointer.registerListener();
        JsPsych.plugin.window.registerListener();
        this.timeline.run();
        JsPsych.plugin.window.init();
    }
    pause() {
        this.timeline.pause();
    }
    resume() {
        this.timeline.resume();
    }
    get currTrial() {
        return this.timeline.getActivateTrial();
    }
    get currTime() {
        return new Date().getTime();
    }
    static get instance() {
        if (JsPsych.only_instance === undefined) {
            JsPsych.only_instance = new JsPsych();
        }
        return JsPsych.only_instance;
    }
}
import { Data } from "./module/data";
import { TimerAPI } from "./module/plugin-api";
import { TimelineArray, TimelineDescription } from "./timeline";
import { Timeline } from "./timeline/Timeline";

export class JsPsych {
    private static only_instance: JsPsych | undefined;
    private timeline: Timeline;
    public plugin: { timer: TimerAPI; };
    public data: Data = new Data();

    constructor() {
        this.data.reset();
        this.plugin = {
            timer: new TimerAPI()
        }
        this.timeline = new Timeline([], document.documentElement);
    }
    load(timeline: TimelineDescription | TimelineArray, dom: HTMLElement) {
        this.timeline = new Timeline(timeline, dom);
    }
    next() {
        this.timeline.next();
    }
    run() {
        this.timeline.run();
    }
    get currTrial() {
        return this.timeline.getActivateTrial();
    }
    static get instance() {
        if (JsPsych.only_instance === undefined) JsPsych.only_instance = new JsPsych();
        return JsPsych.only_instance;
    }
}
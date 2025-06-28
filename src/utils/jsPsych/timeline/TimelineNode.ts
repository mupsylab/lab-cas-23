import { TimelineDescription, TrialDescription, TrialResults } from ".";
import { Timeline } from "./Timeline";

export abstract class TimelineNode {
    public abstract readonly parent?: Timeline | HTMLElement;
    public abstract readonly description?: TrialDescription | TimelineDescription;

    public index?: number;

    abstract pause(): void;
    abstract resume(): void;

    abstract reset(): void;
    abstract run(): void;
    abstract getResults(i: number): TrialResults;

    constructor() { }
}
<script setup lang="ts">
import { onMounted, onUnmounted, Ref, ref } from 'vue';
import { Scene } from './Scene';
import { JsPsych } from '@/utils/jsPsych/jsPsych';

const props = defineProps({
    /**
     * 中间面孔
     */
    mid: {
        type: String,
        default: "m1"
    },
    /**
     * 背景
     */
    bgs: {
        type: Array<string>,
        default: ["b_happy", "b_angry"]
    }
});
const scene = new Scene(props.bgs, props.mid);

const record: {
    trial_type: "drag-core";
    /**开始时间 */
    start_time: number;
    /**按键时间 */
    end_time: number;
    /**反应时间 */
    rt: number;
    /**选择反应 */
    response: string;
    /**
     * 鼠标轨迹
     * 0，1 是鼠标x y
     * 2，3 是鼠标偏移到图片左上角的x y
     * 4，5 是画板的宽 高
     * 6 是当前数据的时间戳
     */
    cursors: Array<[number, number, number, number, number, number, number]>;
    c_picture: string;
    /**
     * 背景四个角落的图片
     * 左上 右上 坐下 右下
     */
    c_picture_bgs: Array<string>;
} = {
    trial_type: "drag-core",
    start_time: JsPsych.instance.currTime,
    end_time: -1,
    rt: -1,
    response: "",
    cursors: [],
    c_picture: props.mid,
    c_picture_bgs: props.bgs
};

const dom = ref<HTMLCanvasElement>() as Ref<HTMLCanvasElement>;
onMounted(async () => {
    dom.value.width = window.innerWidth;
    dom.value.height = window.innerHeight;
    
    const ctx = dom.value.getContext("2d");
    if (!ctx) { return; }
    await scene.waitForReady();
    scene.reset(dom.value.width, dom.value.height);
    record.start_time = JsPsych.instance.currTime;
    frame(ctx);
});
onUnmounted(() => {
    continueFrame = false;
});
let continueFrame = true;
function frame(ctx: CanvasRenderingContext2D) {
    if (!continueFrame) { return; }
    scene.draw(ctx);
    requestAnimationFrame(() => frame(ctx));
}

const drag = (e: PointerEvent) => {
    const { type, offsetX, offsetY } = e;
    /**
     * 将数值缩放 0 - 1 之间
     */
    const [x, y] = [
        offsetX,
        offsetY
    ];

    const time = JsPsych.instance.currTime;
    switch (type) {
        case "pointerdown":
            if (dom.value.dataset.drag === "stop") return;
            const instance = scene.getValidFocusObj(x, y);
            if (instance == undefined) return;
            dom.value.dataset.drag = "dragging";
            break;
        case "pointerup":
            if (dom.value.dataset.drag === "stop") return;
            dom.value.dataset.drag = "release";
            break;
        case "pointermove":
            if (dom.value.dataset.drag !== "dragging") return;
            scene.moveValidObj(x, y);
            record.end_time = time;
            record.cursors.push([x, y, scene.dx, scene.dy, dom.value.width, dom.value.height, time]);
            scene.judge(x, y).then(i => {
                if (i === -1) return;
                dom.value.dataset.drag = "stop"
                end(i);
            });
            break;
    }
}
const end = (i: number) => {
    record.response = props.bgs[i];
    record.rt = record.end_time - record.start_time;
    JsPsych.plugin.timer.setTimeout(() => {
        JsPsych.instance.currTrial.finish(record);
    }, 1000);
};
</script>

<template>
    <canvas ref="dom" @pointermove="drag" @pointerdown="drag" @pointerup="drag"></canvas>
</template>

<style lang="css" scoped>

</style>

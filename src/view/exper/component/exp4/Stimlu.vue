<script setup lang="ts">
import { JsPsych } from '@/utils/jsPsych/jsPsych';
import { onMounted, onUnmounted, Ref, ref } from 'vue';

let resp = {
    /**
     * trial 开始呈现时间
     */
    start_time: -1,
    /**
     * trial 呈现的结束时间
     */
    end_time: -1,
    /**
     * trial 反应的时间
     */
    resp_time: -1,
    /**
     * trial 反应的帧间隔（距离第一帧）
     */
    resp_frame: -1,
    /**
     * trial 反应的图片刺激
     */
    resp_index: -1
}

const opts = {
    loop: 20,
    rest: 2
}

function calcColor() {
    if (resp.resp_index != -1 && resp.resp_index < props.detection_index) {
        // 按键在决策目标之前
        return "#ff0000";
    }
    if (resp.resp_index >= props.detection_index) {
        // 按键在决策目标之后
        return "#00ff00";
    }
    return "#d3d3d3";
}

function load() {
    return Promise.all(props.imgs.map(url => {
        return new Promise<HTMLImageElement>((resolve) => {
            const img = document.createElement("img");
            img.onload = () => {
                resolve(img);
            }
            img.src = url;
        });
    }));
}

const props = defineProps({
    imgs: {
        type: Array<string>,
        required: true
    },
    seq: {
        type: Array<number>,
        required: true
    },
    detection_index: {
        type: Number,
        required: true
    }
});

const imgs: Array<HTMLImageElement> = [];
let continue_f = true;
let count = 0; // 计数
function frame() {
    const ctx = dom.value.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, dom.value.width, dom.value.height);

    const currId = Math.floor(count / opts.loop); // loop帧为一轮
    if (count % opts.loop >= opts.loop - opts.rest) {
        count += 1;
        if (continue_f) window.requestAnimationFrame(frame);
        return;
    } // 休息帧
    if (currId >= props.seq.length) {
        resp.end_time = JsPsych.instance.currTime;
        end();
        return;
    } // 刺激呈现完毕, 结束

    const index = props.seq[currId];
    const currImg = imgs[Math.abs(index)];
    const width = currImg.width * 0.1;
    const height = currImg.height * 0.1;

    ctx.fillStyle = calcColor();
    ctx.rect(
        (dom.value.width - width) / 2,
        (dom.value.height - height) / 2 - 30,
        width, 30
    );
    ctx.fill();
    ctx.drawImage(
        currImg,
        0, 0, currImg.width, currImg.height,
        (dom.value.width - width) / 2,
        (dom.value.height - height) / 2,
        width, height
    );
    // 黑白图
    const imgdata = ctx.getImageData(
        (dom.value.width - width) / 2,
        (dom.value.height - height) / 2,
        width, height
    );

    if (index < 0) {
        const t_id: Array<number> = [];
        imgdata.data.forEach((_, i) => {
            if (i % 4 == 0) {
                const average = Math.round((imgdata.data[i] + imgdata.data[i + 1] + imgdata.data[i + 2]) / 3);
                t_id[i] = t_id[i + 1] = t_id[i + 2] = average;
                t_id[i + 3] = 255; // alpha
            }
        });
        const new_imagdata = ctx.createImageData(imgdata.width, imgdata.height);
        new_imagdata.data.set(t_id);
        ctx.putImageData(new_imagdata, (dom.value.width - width) / 2, (dom.value.height - height) / 2);
    }

    ctx.rect(
        (dom.value.width - width) / 2,
        (dom.value.height - height) / 2 + height,
        width, 30
    );
    ctx.fill();

    count += 1;
    if (continue_f) window.requestAnimationFrame(frame);
}

const dom = ref() as Ref<HTMLCanvasElement>;
onMounted(() => {
    dom.value.width = window.innerWidth;
    dom.value.height = window.innerHeight;

    const ctx = dom.value.getContext("2d");
    if (!ctx) { return; }
    load().then(r => {
        r.forEach(i => { imgs.push(i); });
        frame();
        resp.start_time = JsPsych.instance.currTime;
        JsPsych.plugin.keyboard.addListener(handleKey);
    });
});
onUnmounted(() => {
    continue_f = false;
});

function end() {
    JsPsych.instance.currTrial.finish({
        trial_type: "RSVP",
        ...resp
    })
}

function handleKey(e: KeyboardEvent, t: number) {
    if (e.key != " ") {
        return;
    }
    resp.resp_frame = count;
    JsPsych.plugin.keyboard.removeListener(handleKey);
    resp.resp_time = t;
    resp.resp_index = Math.floor(resp.resp_frame / opts.loop);
}
</script>

<template>
    <canvas ref="dom"></canvas>
</template>

<style scoped></style>
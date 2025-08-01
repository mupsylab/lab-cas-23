<script setup lang="ts">
import { h, onMounted } from 'vue';
import { JsPsych } from '../../utils/jsPsych/jsPsych';
import { TimelineArray } from '../../utils/jsPsych/timeline';

import Preload from '@/utils/jsPsych/plugin/Preload.vue';
import HtmlKeyboard from '@/utils/jsPsych/plugin/HtmlKeyboard.vue';
import Survey from '@/utils/jsPsych/plugin/Survey.vue';
import Instruction from '@/utils/jsPsych/plugin/Instruction.vue';
import DragPage from './component/exp3/DragPage.vue';
import Instruct_all from './component/exp3/Instruct_all.vue';

JsPsych.opts = {
    ...JsPsych.opts,
    iti: 0,
    // forceDirection: "h",
    toastClose: false
}
const jspsych = JsPsych.instance;
const timeline: TimelineArray = [];

timeline.push({
    component: h(Preload, {
        assets: [
            ["happy-m1", "./assets/imgs/Y1M-19_neutral.jpg"],
            ["happy-m2", "./assets/imgs/Y2M-21_neutral.jpg"],
            ["happy-m3", "./assets/imgs/Y8M-27_neutral.jpg"],
            ["happy-m4", "./assets/imgs/Y10M-22_neutral.jpg"],
            ["happy-m5", "./assets/imgs/Y11M-20_neutral.jpg"],
            ["happy-m6", "./assets/imgs/Y15M-20_neutral.jpg"],
            ["happy-m7", "./assets/imgs/Y16M-21_neutral.jpg"],
            ["happy-m8", "./assets/imgs/Y21M-21_neutral.jpg"],
            ["happy-f1", "./assets/imgs/Y4F-19_neutral.jpg"],
            ["happy-f2", "./assets/imgs/Y5F-24_neutral.jpg"],
            ["happy-f3", "./assets/imgs/Y6F-23_neutral.jpg"],
            ["happy-f4", "./assets/imgs/Y17F-33_neutral.jpg"],
            ["happy-f5", "./assets/imgs/Y18F-18_neutral.jpg"],
            ["happy-f6", "./assets/imgs/Y22F-30_neutral.jpg"],
            ["happy-f7", "./assets/imgs/Y23F-30_neutral.jpg"],
            ["happy-f8", "./assets/imgs/Y39F-25_neutral.jpg"]
        ]
    })
});

timeline.push({
    component: h(Survey, {
        ques: [
            { name: "pid", type: "text", title: "被试编号", placeholder: "请输入您所分配的被试编号", valid: [{ required: true }] },
            { name: "gender", type: "radio", title: "您的性别", choices: ["男", "女"] },
        ]
    })
});

timeline.push({
    component: h(Instruction, {
        pages: [Instruct_all]
    })
});

timeline.push({
    component: h(Instruction, {
        pages: [h("p", "接下来进入正式实验。")]
    })
});
timeline.push({
    timeline: [{
            component() {
                return h(HtmlKeyboard, {
                    stimulus: "+",
                    stimulus_duration: 500,
                    trial_duration_time: 1000,
                })
            }
        }, {
        component() {
            const { face, bgs } = jspsych.currTrial.parent.getAllTimelineVariables();
            return h(DragPage, {
                mid: face,
                bgs: bgs
            });
        },
        on_finish(data) {
            const { correct } = jspsych.currTrial.parent.getAllTimelineVariables();
            data.correct = correct === data.response ? 1 : 0;
        }
    }],
    timeline_variables: [
        { face: "m2", bgs: ["m1", "m3"], correct: "m3" }
    ],
    randomize_order: true
});

timeline.push({
    component: h(HtmlKeyboard, {
        stimulus: `
<div style="font-size: 48px; line-height: 96px;">实验结束</div>
<div style="font-size: 24px; color: var(--font-desc);">&copy; Mupsy 技术支持</div>`,
        choices: ["NO_KEYS"]
    }),
    on_load() {
        JsPsych.plugin.window.destoryListener();
        console.log(jspsych.data.get().json())
    }
});

onMounted(() => {
    const expDom = document.querySelector("#exp") as HTMLDivElement;
    jspsych.load(timeline, expDom);
});
</script>

<template>
    <div id="exp"></div>
</template>

<style lang="css" scoped>
#exp {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}
</style>
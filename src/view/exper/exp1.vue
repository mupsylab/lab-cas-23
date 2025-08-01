<script setup lang="ts">
import { h, onMounted } from 'vue';
import { JsPsych } from '../../utils/jsPsych/jsPsych';
import { TimelineArray } from '../../utils/jsPsych/timeline';

import Preload from '@/utils/jsPsych/plugin/Preload.vue';
import HtmlKeyboard from '@/utils/jsPsych/plugin/HtmlKeyboard.vue';
import SliderChoose from './component/exp1/SliderChoose.vue';
import { exp1Dims, exp1Words } from './config';
import Instruction from '@/utils/jsPsych/plugin/Instruction.vue';
import Instruct_all from './component/exp1/Instruct_all.vue';
import Survey from '@/utils/jsPsych/plugin/Survey.vue';

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
            ["l1", "./assets/logo/logo.svg"],
            ["l2", "./assets/logo/logo_64_64.png"],
            ["l3", "./assets/logo/logo_128_128.png"],
            ["l4", "./assets/logo/logo_256_256.png"],
            ["l5", "./assets/logo/logo_512_512.png"]
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
})

timeline.push({
    timeline: [{
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
                const { word, dim } = jspsych.currTrial.parent.getAllTimelineVariables();
                return h(SliderChoose, {
                    word: word,
                    dims: dim
                })
            }
        }],
        timeline_variables: exp1Words.map(item => {
            return {
                word: item
            }
        }),
        randomize_order: true
    }, {
        component: h(Instruction, {
            pages: [h("p", {}, "现在可以休息一下")]
        })
    }],
    timeline_variables: exp1Dims.map(item => {
        return {
            dim: item
        }
    }),
    randomize_order: true
})

timeline.push({
    component: h(HtmlKeyboard, {
        stimulus: `
<div style="font-size: 48px; line-height: 96px;">实验结束</div>
<div style="font-size: 24px; color: var(--font-desc);">&copy; Mupsy 技术支持</div>`,
        choices: ["NO_KEYS"]
    }),
    on_load() {
        JsPsych.plugin.window.destoryListener();
        // 在实验结束时自动下载数据
        const blob = new Blob([jspsych.data.get().csv()], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'experiment_data.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
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
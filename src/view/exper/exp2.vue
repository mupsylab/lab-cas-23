<script setup lang="ts">
import { h, onMounted } from 'vue';
import { JsPsych } from '../../utils/jsPsych/jsPsych';
import { TimelineArray } from '../../utils/jsPsych/timeline';

import Preload from '@/utils/jsPsych/plugin/Preload.vue';
import HtmlKeyboard from '@/utils/jsPsych/plugin/HtmlKeyboard.vue';
import Survey from '@/utils/jsPsych/plugin/Survey.vue';
import Instruction from '@/utils/jsPsych/plugin/Instruction.vue';
import DragPage from './component/exp2/DragPage.vue';
import Instruct_all from './component/exp2/Instruct_all.vue';
import { ElMessage } from 'element-plus';
import { exp2TimeVars, faceImgs, save_csv } from './config';

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
            ...faceImgs,
            ["b_happy", "https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=423474926,1801248814&fm=179&app=35&f=PNG?w=518&h=136&s=ADFEEB16D210A1925C7BF2EA0300E03E"],
            ["b_sad", "https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=423474926,1801248814&fm=179&app=35&f=PNG?w=518&h=136&s=ADFEEB16D210A1925C7BF2EA0300E03E"],
            ["b_fear", "https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=423474926,1801248814&fm=179&app=35&f=PNG?w=518&h=136&s=ADFEEB16D210A1925C7BF2EA0300E03E"],
            ["b_angry", "https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=423474926,1801248814&fm=179&app=35&f=PNG?w=518&h=136&s=ADFEEB16D210A1925C7BF2EA0300E03E"],
            ["b_surprise", "https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=423474926,1801248814&fm=179&app=35&f=PNG?w=518&h=136&s=ADFEEB16D210A1925C7BF2EA0300E03E"],
            ["b_disgust", "https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=423474926,1801248814&fm=179&app=35&f=PNG?w=518&h=136&s=ADFEEB16D210A1925C7BF2EA0300E03E"],
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
    timeline: [{
        component: h(Instruction, {
            pages: [h("p", "接下来开始练习")]
        })
    }, {
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
                const { c_picture, response } = data;
                const correct = c_picture.split("-")[1] === response.split("_")[1];
                data.correct = correct ? 1 : 0;
            }
        }],
        timeline_variables: exp2TimeVars,
        randomize_order: true,
        trial_num: 10
    }],
    loop_function() {
        const correct = jspsych.data.get().filter({ trial_type: "drag-core" }).last(10).select("correct").mean();
        if (!correct || correct < 0.8) {
            ElMessage.error("正确率过低, 重新练习");
            return true;
        }
        return false;
    }
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
            const { c_picture, response } = data;
            const correct = c_picture.split("-")[1] === response.split("_")[1];
            data.correct = correct ? 1 : 0;
        }
    }, {
        timeline: [{
            component: h(Instruction, {
                pages: [h("p", "休息一下吧")]
            })
        }],
        conditional_function() {
            const trial_id = jspsych.data.get().last(1).values()[0].trial_id as string;
            const r = trial_id.split("-").map(s => s.split("."));
            const i = parseInt(r[1][2]) + 1;
            return i % 60 == 0 && i > 0;
        }
    }],
    timeline_variables: exp2TimeVars,
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
        save_csv(jspsych.data.get().csv(), "experiment2_data");
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
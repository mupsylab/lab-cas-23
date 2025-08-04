<script setup lang="ts">
import { h, onMounted } from 'vue';
import { JsPsych } from '../../utils/jsPsych/jsPsych';
import { TimelineArray } from '../../utils/jsPsych/timeline';

import Preload from '@/utils/jsPsych/plugin/Preload.vue';
import HtmlKeyboard from '@/utils/jsPsych/plugin/HtmlKeyboard.vue';
import SliderChoose from './component/exp1/SliderChoose.vue';
import { exp1Dims, exp1Words, save_csv } from './config';
import Instruction from '@/utils/jsPsych/plugin/Instruction.vue';
import Instruct_all from './component/exp1/Instruct_all.vue';
import Survey from '@/utils/jsPsych/plugin/Survey.vue';
import { save_s3 } from '@/utils/dataSaver/s3';
import { ElMessage } from 'element-plus';

JsPsych.opts = {
    ...JsPsych.opts,
    iti: 0,
    // forceDirection: "h",
    toastClose: true
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

const paths: Array<string> = [];
timeline.push({
    component: h(Survey, {
        ques: [
            { name: "name", type: "text", title: "您的姓名", placeholder: "请输入您的姓名", valid: [{ required: true }] },
            { name: "gender", type: "radio", title: "您的性别", choices: ["男", "女"], valid: [{ required: true }] },
            { name: "c_name", type: "text", title: "您孩子的姓名", placeholder: "请输入您孩子的姓名" },
            { name: "c_gender", type: "radio", title: "您孩子的性别（如果有）", choices: ["男", "女"] },
            { name: "idcard", type: "text", title: "身份证后六位", placeholder: "请输入您的身份证后六位", valid: [{ required: true }] },
            { name: "birth", type: "date", title: "请选择您的出生年月日", valid: [{ required: true }] },
        ]
    }),
    on_finish(data) {
        paths.push(`${JsPsych.instance.currTime}`);
        paths.push(data.name);
        paths.push(data.gender);
        paths.push(data.idcard);
    }
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
        save_s3({
            csv: jspsych.data.get().csv(),
            accessKey: "5tX6L87S3cWnxUaT2ODu",
            secretKey: "vILiDmpXB6u7fZNUsTeM9xclHjVGAK5oOrPCzbtq",
            bucket: "psydata",
            endpoint: "http://n1.jimoco.cn:29513/oss",
            region: "cn",
            fileName: `lab-cas-23/exp1/${paths.join("_")}.csv`
        })
        .then(() => {
            ElMessage.success("数据上传完成");
        })
        .catch(() => {
            ElMessage.error("数据上传失败");
            save_csv(jspsych.data.get().csv(), "experiment1_data");
        });
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
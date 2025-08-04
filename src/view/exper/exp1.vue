<script setup lang="ts">
import { h, onMounted } from 'vue';
import { JsPsych } from '../../utils/jsPsych/jsPsych';
import { TimelineArray } from '../../utils/jsPsych/timeline';

import Preload from '@/utils/jsPsych/plugin/Preload.vue';
import HtmlKeyboard from '@/utils/jsPsych/plugin/HtmlKeyboard.vue';
import SliderChoose from './component/exp1/SliderChoose.vue';
import { exp1Dims, exp1Words, partInfo, S3Auth } from './config';
import Instruction from '@/utils/jsPsych/plugin/Instruction.vue';
import Instruct_all from './component/exp1/Instruct_all.vue';
import Survey from '@/utils/jsPsych/plugin/Survey.vue';
import EndExp from './component/endExp.vue';

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

const paths: Array<string> = ["exp1"];
timeline.push({
    component: h(Survey, {
        ques: partInfo as any
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
    component() {
        return h(EndExp, {
            s3: {
                ...S3Auth,
                bucket: "psydata",
                endpoint: "https://psy.mupsycho.com/http://n1.jimoco.cn:29513/oss",
                signEndpoint: "http://n1.jimoco.cn:29513",
                region: "cn",
                fileName: `lab-cas-23/exp1/${paths.join("_")}.csv`
            }
        })
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
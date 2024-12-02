<template>
    <div id="exp"></div>
</template>

<script setup lang="ts">
import { h, onMounted } from 'vue';
import { JsPsych } from '../../utils/jsPsych/jsPsych';
import { TimelineArray } from '../../utils/jsPsych/timeline';

import Preload from '../../component/plugin/Preload.vue';
import EndExp from '../../component/endExp.vue';
import Survey from '../../component/plugin/Survey.vue';
import HtmlKeyboard from '../../component/plugin/HtmlKeyboard.vue';

const jspsych = JsPsych.instance;
const timeline: TimelineArray = [];

timeline.push({
    component: h(Preload, {
        assets: [
            "./assets/logo/logo.svg",
            "./assets/logo/logo_64_64.png",
            "./assets/logo/logo_128_128.png",
            "./assets/logo/logo_256_256.png",
            "./assets/logo/logo_512_512.png"
        ]
    })
});

let i = 0;
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
            return h(HtmlKeyboard, {
                stimulus: i.toString(),
                stimulus_duration: 500,
                trial_duration_time: 1000,
            })
        },
        on_start() {
            i += 1;
        }
    }],
    repetitions: 5,
    conditional_function() {
        return true;
    },
    loop_function(data) {
        console.log(data);
        return false;
    }
});

timeline.push({
    component: h(EndExp, {
        onEnd() {
            console.log(jspsych.data)
        }
    })
});

onMounted(() => {
    const expDom = document.querySelector("#exp") as HTMLDivElement;
    jspsych.load(timeline, expDom);
});
</script>
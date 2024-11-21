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

timeline.push({
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
            stimulus: "666"
        })
    }
}, {
    component() {
        return h(Survey)
    },
    on_start(trial) {
        console.log(trial.parent?.getAllTimelineVariables());
    },
    on_load(component) {
        console.log(component);
    },
    on_finish(data) {
        console.log(data)
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
    jspsych.run();
});
</script>
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

const jspsych = JsPsych.instance;
const timeline: TimelineArray = [];

timeline.push({
    component: h(Preload, {
        assets: [
            "./assets/logo/logo.svg",
            "./assets/logo/logo_64_64.png",
            "./assets/logo/logo_128_128.png"
        ]
    })
});

timeline.push({
    component() {
        return h(Survey)
    },
    on_start(trial) {
        console.log(trial.parent?.getAllTimelineVariables());
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
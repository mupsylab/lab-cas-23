<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { JsPsych } from '@/utils/jsPsych/jsPsych';
import { ElButton } from 'element-plus';

const props = defineProps({
    stimulus: {
        type: String,
        default: ""
    },
    trial_duration_time: {
        type: Number,
        default: 0
    },
    response_ends_trial: {
        type: Boolean,
        default: true
    },
    choices: {
        type: Array<String>,
        default: []
    }
});

const click = (e: String, time: number) => {
    const result = {
        rt: JsPsych.instance.currTrial.getIntervalTime(time),
        response: e,
        stimulus: props.stimulus
    };
    end(false, result);
};
const end = (timer = false, result = {}) => {
    const data = {
        trial_type: "html-button",
        ...result
    };
    if (props.response_ends_trial && !timer) {
        JsPsych.instance.currTrial.finish(data);
    }
    if (timer) {
        JsPsych.instance.currTrial.finish(data);
    }
}

const dom = ref<HTMLDivElement>();
onMounted(() => {
    if (props.trial_duration_time > 0) {
        JsPsych.plugin.timer.setTimeout(() => {
            end(true);
        }, props.trial_duration_time);
    }
});
</script>

<template>
    <div class="plugin-box" ref="dom">
        <div v-html="props.stimulus"></div>
        <div>
            <template v-for="(item) in props.choices">
                <ElButton @click="click(item, JsPsych.instance.currTime)">{{ item }}</ElButton>
            </template>
        </div>
    </div>
</template>

<style scoped>
.plugin-box {
    font-size: 48px;
    line-height: 64px;
}
</style>
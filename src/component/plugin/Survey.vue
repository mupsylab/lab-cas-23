<script setup lang="ts">
import { JsPsych } from '../../utils/jsPsych/jsPsych';
import { Ques } from '../questionnaire/Questionnaire';
import Questionnaire from '../questionnaire/Questionnaire.vue';

const props = defineProps({
    ques: {
        type: Array<Ques>,
        default: [
            { name: "aa0", type: "desc", desc: "你需要尽可能多的输入内容" },
            { name: "aa1", type: "text", title: "测试填空题", placeholder: "请输入需要的文本", valid: [{ required: true }] },
            { name: "aa2", type: "radio", title: "测试单选题", choices: ["1", "2"] },
            { name: "aa3", type: "checkbox", title: "测试多选题", choices: ["1", "2"] },
            { name: "aa4", type: "switch", title: "测试选项卡", choices: ["1", "2"] },
            { name: "aa5", type: "date", title: "日期选择" },
        ]
    }
});

const end = (data: Record<string, any>) => {
    JsPsych.instance.currTrial.finish(Object.assign({}, {
        trial_type: "survey"
    }, data));
}
</script>

<template>
    <div class="plugin-box">
        <Questionnaire :ques="props.ques" @end-trial="end" />
    </div>
</template>
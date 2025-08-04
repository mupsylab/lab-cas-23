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
import { exp3TimeVars, faceImgs, save_csv } from './config';
import { ElMessage } from 'element-plus';
import { save_s3 } from '@/utils/dataSaver/s3';
import Instruct_prac from './component/exp3/Instruct_prac.vue';
import Instruct_form from './component/exp3/Instruct_form.vue';
import EnterFullScreen from '@/utils/jsPsych/plugin/EnterFullScreen.vue';

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
            ...faceImgs,
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
    component: h(EnterFullScreen, {
        model: true
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
            pages: [Instruct_prac]
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
                const correct = c_picture.split("-")[1] === response.split("-")[1];
                data.correct = correct ? 1 : 0;
                data.prac = 1;
            }
        }, {
            component() {
                const { correct } = jspsych.data.get().last(1).values()[0] as { correct: number };
                return h(HtmlKeyboard, {
                    stimulus: correct == 1 ? "你选对了！" : "再想一想",
                    stimulus_duration: 500,
                    trial_duration_time: 1000,
                })

            }
        }],
        timeline_variables: exp3TimeVars,
        randomize_order: true,
        trial_num: 6
    }],
    loop_function() {
        const correct = jspsych.data.get().filter({ trial_type: "drag-core" }).last(6).select("correct").mean();
        if (!correct || correct < 0.8) {
            ElMessage.error("正确率过低, 重新练习");
            return true;
        }
        return false;
    }
});

timeline.push({
    component: h(Instruction, {
        pages: [
            Instruct_form
        ]
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
            const correct = c_picture.split("-")[1] === response.split("-")[1];
            data.correct = correct ? 1 : 0;
            data.prac = 0;
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
            return i % 30 == 0 && i > 0;
        }
    }],
    timeline_variables: exp3TimeVars,
    randomize_order: true
});
timeline.push({
    component: h(EnterFullScreen, {
        model: false
    })
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
        save_s3({
            csv: jspsych.data.get().csv(),
            accessKey: "5tX6L87S3cWnxUaT2ODu",
            secretKey: "vILiDmpXB6u7fZNUsTeM9xclHjVGAK5oOrPCzbtq",
            bucket: "psydata",
            endpoint: "http://n1.jimoco.cn:29513/oss",
            region: "cn",
            fileName: `lab-cas-23/exp3/${paths.join("_")}.csv`
        })
            .then(() => {
                ElMessage.success("数据上传完成");
            })
            .catch(() => {
                ElMessage.error("数据上传失败");
                save_csv(jspsych.data.get().csv(), "experiment3_data");
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
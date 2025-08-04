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
import { exp2TimeVars, faceImgs, partInfo } from './config';
import Instruct_detail from './component/exp2/Instruct_detail.vue';
import { useLoaderAssets } from '@/store/loadAssetsToBlob';
import Instruct_all_display from './component/exp2/Instruct_all_display.vue';
import Instruct_prac from './component/exp2/Instruct_prac.vue';
import Instruct_form from './component/exp2/Instruct_form.vue';
import EnterFullScreen from '@/utils/jsPsych/plugin/EnterFullScreen.vue';
import EndExp from './component/endExp.vue';

JsPsych.opts = {
    ...JsPsych.opts,
    iti: 0,
    // forceDirection: "h",
    toastClose: true
}
const jspsych = JsPsych.instance;
const timeline: TimelineArray = [];
const loader = useLoaderAssets();

timeline.push({
    component: h(Preload, {
        assets: [
            ...faceImgs,
            ["b_happy", "./assets/imgs/happy.png"],
            ["b_sad", "./assets/imgs/sad.png"],
            ["b_fear", "./assets/imgs/fear.png"],
            ["b_angry", "./assets/imgs/angry.png"],
            ["b_surprise", "./assets/imgs/surprise.png"],
            ["b_disgust", "./assets/imgs/disgust.png"],
        ]
    })
});

const paths: Array<string> = [];
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
    component: h(EnterFullScreen, {
        model: true
    })
});

timeline.push({
    component() {
        return h(Instruction, {
            pages: [
                Instruct_all,
                h(Instruct_detail, {
                    img1: loader.getAssets("b_happy"),
                    img2: loader.getAssets("h1-happy"),
                    desc: "这个房子里的人正在一起吃冰淇淋，大家非常开心。",
                }),
                h(Instruct_detail, {
                    img1: loader.getAssets("b_fear"),
                    img2: loader.getAssets("h1-fear"),
                    desc: "这个房子里的人看到窗外有一只狼，非常害怕。",
                }),
                h(Instruct_detail, {
                    img1: loader.getAssets("b_sad"),
                    img2: loader.getAssets("h1-sad"),
                    desc: "这个房子里的人考试成绩不理想，感到很难过。",
                }),
                h(Instruct_detail, {
                    img1: loader.getAssets("b_disgust"),
                    img2: loader.getAssets("h1-disgust"),
                    desc: "这个房子里的人看到变质的食物，感到非常厌恶。",
                }),
                h(Instruct_detail, {
                    img1: loader.getAssets("b_angry"),
                    img2: loader.getAssets("h1-angry"),
                    desc: "这个房子里的人和同学发生了争吵，非常生气。",
                }),
                h(Instruct_detail, {
                    img1: loader.getAssets("b_surprise"),
                    img2: loader.getAssets("h1-surprise"),
                    desc: "这个房子里的人听到了一声巨响，感到非常惊讶。",
                }),
                Instruct_all_display
            ]
        })
    }
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
                const correct = c_picture.split("-")[1] === response.split("_")[1];
                data.prac = 1;
                data.correct = correct ? 1 : 0;
                console.log(data);
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
        timeline_variables: exp2TimeVars,
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
        pages: [Instruct_form]
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
    timeline_variables: exp2TimeVars,
    randomize_order: true
});
timeline.push({
    component: h(EnterFullScreen, {
        model: false
    })
});

timeline.push({
    component: h(EndExp, {
        s3: {
            accessKey: "5tX6L87S3cWnxUaT2ODu",
            secretKey: "vILiDmpXB6u7fZNUsTeM9xclHjVGAK5oOrPCzbtq",
            bucket: "psydata",
            endpoint: "https://psy.mupsycho.com/http://n1.jimoco.cn:29513/oss",
            signEndpoint: "http://n1.jimoco.cn:29513",
            region: "cn",
            fileName: `lab-cas-23/exp2/${paths.join("_")}.csv`
        }
    })
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
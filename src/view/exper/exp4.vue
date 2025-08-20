<script setup lang="ts">
import { h, onMounted } from 'vue';
import { JsPsych } from '../../utils/jsPsych/jsPsych';
import { TimelineArray } from '../../utils/jsPsych/timeline';

import Preload from '@/utils/jsPsych/plugin/Preload.vue';
import { exp4TimeVars, faceImgs, partInfo, S3Auth } from './config';
import EndExp from './component/endExp.vue';
import Stimlu from './component/exp4/Stimlu.vue';
import { useLoaderAssets } from '@/store/loadAssetsToBlob';
import Survey from '@/utils/jsPsych/plugin/Survey.vue';
import EnterFullScreen from '@/utils/jsPsych/plugin/EnterFullScreen.vue';
import Instruction from '@/utils/jsPsych/plugin/Instruction.vue';
import Instruct_all from './component/exp4/Instruct_all.vue';
import Instruct_prac from './component/exp4/Instruct_prac.vue';
import HtmlKeyboard from '@/utils/jsPsych/plugin/HtmlKeyboard.vue';
import { ElMessage } from 'element-plus';
import Instruct_form from './component/exp4/Instruct_form.vue';

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
        ]
    })
});

const paths: Array<string> = ["exp4"];
timeline.push({
    component: h(Survey, {
        ques: partInfo
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
                const { imgs, seq, detection } = jspsych.currTrial.parent.getAllTimelineVariables();
                return h(Stimlu, {
                    imgs: imgs.map((s: string) => loader.getAssets(s)),
                    seq: seq,
                    detection_index: detection
                });
            },
            on_finish(data) {
                const { imgs, seq, detection, rsvp_iti } = jspsych.currTrial.parent.getAllTimelineVariables();
                const { resp_index } = data;
                data.cond_imgs = imgs;
                data.cond_seq = seq;
                data.cond_detection = detection;
                data.cond_iti = rsvp_iti;
                data.correct = resp_index >= detection ? 1 : 0;
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
        timeline_variables: exp4TimeVars,
        randomize_order: true,
        trial_num: 6
    }],
    loop_function() {
        const correct = jspsych.data.get().filter({ trial_type: "RSVP" }).last(6).select("correct").mean();
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
            const { imgs, seq, detection } = jspsych.currTrial.parent.getAllTimelineVariables();
            return h(Stimlu, {
                imgs: imgs.map((s: string) => loader.getAssets(s)),
                seq: seq,
                detection_index: detection
            });
        },
        on_finish(data) {
            const { imgs, seq, detection } = jspsych.currTrial.parent.getAllTimelineVariables();
            const { resp_index } = data;
            data.cond_imgs = imgs;
            data.cond_seq = seq;
            data.cond_detection = detection;
            data.correct = resp_index >= detection ? 1 : 0;
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
            return i % 60 == 0 && i > 0;
        }
    }],
    timeline_variables: exp4TimeVars,
    randomize_order: true,
    repetitions: 2
});
timeline.push({
    component: h(EnterFullScreen, {
        model: false
    })
});

timeline.push({
    component() {
        return h(EndExp, {
            s3: {
                ...S3Auth,
                bucket: "psydata",
                endpoint: "https://psy.mupsycho.com/oss",
                signEndpoint: "http://n1.jimoco.cn:29513",
                region: "cn",
                fileName: `lab-cas-23/exp4/${paths.join("_")}.csv`
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
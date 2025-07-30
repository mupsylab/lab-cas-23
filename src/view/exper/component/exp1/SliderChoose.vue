<script setup lang="ts">
import { JsPsych } from '@/utils/jsPsych/jsPsych';
import { ElButton } from 'element-plus';
import { ref } from 'vue';

const props = defineProps({
    word: {
        type: String,
        default: "单词"
    },
    dims: {
        type: String,
        default: "维度"
    }
});
const answer = ref(-1);

const chosAns = (ans: number) => {
    answer.value = ans;
}
const end = () => {
    if (answer.value === -1) return;
    JsPsych.instance.currTrial.finish({
        word: props.word,
        dims: props.dims,
        trial_type: "slider_choose",
        answer: answer.value
    });
}
</script>

<template>
    <div class="sc-box">
        <div class="word">{{ props.word }}</div>
        <div class="desc">这个词与<span style="color: var(--fc-error-color);">{{ props.dims }}</span>有多相关？</div>
        <div class="slider">
            <div v-for="i in [1, 2, 3, 4, 5, 6, 7]" @click="chosAns(i)">
                <p>{{ i }}</p>
                <div class="bar" :class="{
                    chos: i == answer
                }"></div>
            </div>
        </div>
        <div class="tips">
            <div>完全不相关</div>
            <div>非常相关</div>
        </div>
        <div class="btn" v-if="answer > -1">
            <ElButton @click="end">确认</ElButton>
        </div>
    </div>
</template>

<style lang="css">
.sc-box {
    display: flex;
    width: 720px;
    text-align: center;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    user-select: none;
    /* slider bar parameter */
    --w: 36px;
    --h: 32px;
    --dx: 18px;
    --dy: 15px;
}

.word {
    display: inline-block;
    padding: 0 16px;
    font-size: 64px;
    line-height: 96px;
    border: 1px solid var(--font-color);
}

.desc {
    margin: 15% 0;
    font-size: 36px;
    line-height: 64px;
}

.btn {
    display: block;
    position: absolute;
    bottom: 80px;
}

.tips {
    display: flex;
    width: 100%;
    justify-content: space-between;
}

.slider {
    display: flex;
    width: 100%;
    justify-content: space-between;
    position: relative;
}
.slider > div {
    display: inline-block;
    width: var(--w);
    cursor: pointer;
}
.slider p {
    margin: 0 0 10px 0;
    padding: 0;
    font-size: 18px;
    text-align: center;
    font-weight: 700;
}
.slider .bar {
    width: 2px;
    height: var(--h);
    background-color: var(--font-color);
    margin: auto;
}
.slider::before {
    content: "";
    display: block;
    position: absolute;
    bottom: var(--dy);
    left: var(--dx);
    width: calc(100% - var(--w));
    height: 1px;
    background-color: var(--font-color);
}
.slider .bar.chos {
    background-color: var(--fc-error-color);
}

@media screen and (max-width: 768px) {
    .sc-box {
        width: 80%;
    }
    .desc {
        font-size: 28px;
    }
}
</style>

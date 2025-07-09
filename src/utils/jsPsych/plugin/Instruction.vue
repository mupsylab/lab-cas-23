<script setup lang="ts">
import { JsPsych } from '@/utils/jsPsych/jsPsych';
import { ElButton } from 'element-plus';
import { ref } from 'vue';

const props = defineProps<{
    pages: Array<any>;
}>();

const i = ref(0);
const next = () => {
    if (i.value >= props.pages.length - 1) {
        JsPsych.instance.currTrial.finish({
            trial_type: "instruction"
        });
        return;
    }
    i.value++;
};
const prev = () => {
    if (i.value <= 0) return;
    i.value--;
};
</script>

<template>
    <div style="user-select: none;">
        <div class="text-box">
            <template v-for="(page, index) in props.pages" :key="index">
                <component :is="page" v-if="i === index" />
            </template>
        </div>
        <div class="button-box">
            <ElButton @click="prev" v-if="i > 0">上一页</ElButton>
            <ElButton @click="next" v-if="i <= props.pages.length - 1">{{ i === props.pages.length - 1 ? "完成" : "下一页" }}</ElButton>
        </div>
    </div>
</template>

<style lang="css" scoped>
.text-box {
    display: block;
    width: 75vw;
    height: calc(85vh - 46px);
    padding: 16px;
    box-sizing: border-box;
    border: 1px solid var(--dashboard-dividing-component);
    overflow: auto;
}
.text-box :deep(h1) {
    font-size: 36px;
    line-height: 48px;
    text-align: center;
    margin: 0;
    padding: 0;
}
.text-box :deep(p) { 
    font-size: 24px;
    line-height: 1.5em;
}

.button-box {
    display: block;
    width: 75vw;
    height: 56px;
    margin: 20px 0 0 0;
    text-align: center;
}
</style>
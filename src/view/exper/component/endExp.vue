<script setup lang="ts">
import { save_s3 } from '@/utils/dataSaver/s3';
import { JsPsych } from '@/utils/jsPsych/jsPsych';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import { save_csv } from '../config';

type S3Opts = {
    accessKey: string,
    secretKey: string,
    bucket: string,
    endpoint: string,
    signEndpoint?: string,
    region: string,
    fileName: string
}
const props = defineProps<{
    s3: S3Opts;
}>();

const state = ref(0);
onMounted(() => {
    const data = JsPsych.instance.data.get();
    save_s3({
        ...props.s3,
        csv: data.csv()
    })
        .then(() => {
            ElMessage.success("数据上传完成");
            state.value = 1;
            JsPsych.plugin.window.destoryListener();
        })
        .catch(() => {
            ElMessage.error("数据上传失败");
            const p = props.s3.fileName.split("/");
            save_csv(data.csv(), p[p.length - 1]);
            state.value = -1;
            JsPsych.plugin.window.destoryListener();
        });
});
</script>

<template>
    <div>
        <p class="t" v-if="state === 0">数据保存中</p>
        <p class="t" v-if="state === -1">数据上传失败，请联系有关人员</p>
        <p class="t" v-if="state === 1">实验结束</p>
        <p class="c">&copy; Mupsy 技术支持</p>
    </div>
</template>

<style lang="css" scoped>
.t {
    font-size: 48px;
    line-height: 96px;
}
.c {
    font-size: 24px;
    color: var(--font-desc);
}
</style>

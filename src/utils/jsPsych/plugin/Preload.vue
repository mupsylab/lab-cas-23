<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useLoaderAssets } from '@/store/loadAssetsToBlob';
import { useCheckBrowserInfo } from '@/store/browserCheck';
import { JsPsych } from '@/utils/jsPsych/jsPsych';

const props = defineProps({
    assets: Array<[string, string]> // 资源名称和资源路径的元组数组
});
const cbi = useCheckBrowserInfo();
const loader = useLoaderAssets();
const totalNumDom = ref("0");
const countNumDom = ref("-1");

const end = () => {
    const browser = Object.assign({}, cbi.browser);
    JsPsych.instance.currTrial.finish({
        trial_type: "perload",
        browser_info: JSON.stringify(browser)
    });
}
onMounted(() => {
    if (!loader.isInit) {
        props.assets?.forEach(([k, v]) => {
            loader.addAssets(k, v);
        });
        cbi.init();
        loader.startLoad();

        JsPsych.plugin.timer.setInterval(() => {
            if (cbi.isInit && loader.isFinish) {
                end();
            } else {
                const { len, left, loading } = loader.progress;
                totalNumDom.value = len.toString();
                countNumDom.value = (len - left + loading).toFixed(2);
            }
        }, 100);
    } else {
        end();
    }
});
</script>

<template>
    <div class="plugin-box">
        <div>
            {{ countNumDom }} / {{ totalNumDom }}
        </div>
    </div>
</template>
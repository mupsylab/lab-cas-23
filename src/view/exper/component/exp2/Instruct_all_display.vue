<script setup lang="ts">
import { useLoaderAssets } from '@/store/loadAssetsToBlob';
import Instruct_detail from './Instruct_detail.vue';

const loader = useLoaderAssets();
</script>

<template>
    <div class="box">
        <Instruct_detail
            :img1="loader.getAssets(`b_happy`)"
            :img2="loader.getAssets(`h1-happy`)"
            desc="快乐" />
        <Instruct_detail
            :img1="loader.getAssets(`b_sad`)"
            :img2="loader.getAssets(`h1-sad`)"
            desc="悲伤" />
        <Instruct_detail
            :img1="loader.getAssets(`b_fear`)"
            :img2="loader.getAssets(`h1-fear`)"
            desc="恐惧" />
        <Instruct_detail
            :img1="loader.getAssets(`b_disgust`)"
            :img2="loader.getAssets(`h1-disgust`)"
            desc="厌恶" />
        <Instruct_detail
            :img1="loader.getAssets(`b_angry`)"
            :img2="loader.getAssets(`h1-angry`)"
            desc="愤怒" />
        <Instruct_detail
            :img1="loader.getAssets(`b_surprise`)"
            :img2="loader.getAssets(`h1-surprise`)"
            desc="惊讶" />
</div>
</template>

<style lang="css" scoped>
.box {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-row-gap: 100px;
}
</style>

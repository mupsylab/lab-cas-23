<script setup lang="ts">
const props = defineProps({
    img1: {
        type: String,
        default: ""
    },
    img2: {
        type: String,
        default: ""
    },
    desc: {
        type: String,
        default: ""
    }
});
</script>

<template>
    <div>
        <img class="bg" :src="props.img1" alt="">
        <p style="text-align: center;">{{ props.desc }}</p>
        <img class="face" :src="props.img2" alt="">
    </div>
</template>

<style scoped>
.bg {
    display: block;
    width: 128px;
    height: 128px;
    margin: auto;
}
.face {
    display: block;
    width: 100px;
    height: 150px;
    margin: auto;
}
</style>
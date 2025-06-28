<script setup lang="ts">
import { Iphone } from '@element-plus/icons-vue';
</script>

<template>
    <div class="rotary-phone">
        <div class="icon"><Iphone /></div>
        <p class="text">请旋转屏幕</p>
    </div>
</template>

<style scoped>
.rotary-phone .icon {
    animation: ro 1s linear infinite;
}

@keyframes ro {
    0% {
        transform: rotate(0deg);
    }
    10% {
        transform: rotate(10deg);
    }
    50% {
        transform: rotate(30deg);
    }
    90% {
        transform: rotate(-10deg);
    }
    100% {
        transform: rotate(0deg);
    }
}
</style>
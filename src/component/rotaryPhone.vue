<script setup lang="ts">
import { Iphone } from '@element-plus/icons-vue';
</script>

<template>
    <div class="rotary-phone">
        <div class="icon">
            <div><Iphone /></div>
        </div>
        <p class="text">请旋转屏幕</p>
    </div>
</template>

<style scoped>
.rotary-phone .icon {
    width: 128px;
    height: 128px;
    text-align: center;
    animation: ro 1s linear infinite;
}
.rotary-phone .icon div {
    display: inline-block;
    width: 64px;
    height: 64px;
    margin: 32px 0 0 0;
}
p {
    text-align: center;
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
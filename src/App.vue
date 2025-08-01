<script setup lang="ts">
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';

onMounted(() => {
  document.body.addEventListener('touchmove', function (e) {
    e.preventDefault(); // 阻止默认的处理方式(阻止下拉滑动的效果)
  }, { passive: false });
});
</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped>

</style>
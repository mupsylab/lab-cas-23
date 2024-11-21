<script setup lang="ts">
import { JsPsych } from '../../utils/jsPsych/jsPsych';

const end = () => {
    JsPsych.instance.currTrial.finish({
        trial_type: "html-keyboard"
    });
}
</script>

<template>
    <div class="plugin-box">
        <slot></slot>
        <button @click="end">asd</button>
    </div>
</template>
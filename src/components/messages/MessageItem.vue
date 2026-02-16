<script setup lang="ts">

const messageItem = defineProps({
    contentType : String,
    contentValue : String,
    message : String,
});
</script>
<template>

    <p>{{ messageItem.contentType }}</p>
</template>
<style scoped>
</style>
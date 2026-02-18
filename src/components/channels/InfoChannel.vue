<script setup lang="ts">
import UserInfo from '../users/UserInfo.vue';

defineProps({
    isCreator: Boolean
})


</script>
<template>
    <UserInfo :is-creator="isCreator"/>
</template>
<style scoped>
</style>

<script setup lang="ts">
import { useStore } from '@/store';
import { computed, ref, watch } from 'vue';
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

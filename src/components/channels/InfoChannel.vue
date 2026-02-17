<script setup lang="ts">
import { useStore } from '@/store';
import { computed, ref, watch } from 'vue';
import UserInfo from '../users/UserInfo.vue';

const store = useStore();

const isCreator = ref(false);

const channelWatcher = computed(() => store.currentChannel!)

watch(
    channelWatcher,
    () => loadCreatorCheck()
)

const loadCreatorCheck = async () => {
    isCreator.value =store.username == store.currentChannel!.creator
}

loadCreatorCheck()


</script>
<template>
    <UserInfo :is-creator="isCreator"/>
</template>
<style scoped>
</style>

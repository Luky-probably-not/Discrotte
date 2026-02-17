<script setup lang="ts">
import ChannelInfoLayout from '@/components/ChannelInfoLayout.vue';
import ChatLayout from '@/components/ChatLayout.vue';
import UserChannelsLayout from '@/components/UserChannelsLayout.vue';
import { useStore } from '@/store';


const store = useStore();

</script>
<template>
    <UserChannelsLayout />
    <ChatLayout />
    <ChannelInfoLayout/>

</template>
<style scoped>
</style>

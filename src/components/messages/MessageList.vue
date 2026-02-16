<script setup lang="ts">
// import MessageItem from '@/components/messages/MessageItem.vue';
// import { ref } from 'vue';

// const messages = ref([]);
// const ws = new WebSocket(`/ws/channel/${channel_id}/token/${token}`)
// const wsConnEstablished = ref(false);

// ws.onopen = () => {
//   wsConnEstablished.value = true;
//   ws.send("get");
// }

// ws.onmessage = (e) => {
//   if (!isNaN(e.data)) {
//     messages.value.push(e.data);
//   }
// }

// const closeChannel = () => {
//   if (wsConnEstablished.value) {
//     ws.close();
//   }
// }
</script>
<template>
    <Message />
</template>
<style scoped>
</style>
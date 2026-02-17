<script setup lang="ts">
import MessageItem from '@/components/messages/MessageItem.vue';
import type { Message } from '@/types';
import { ref, onUnmounted, watch } from 'vue';
import { getChannelMessages } from '@/api/message';
import { useStore } from '@/store';

const messages = ref<Message[]>([]);
let ws: WebSocket | null = null;
const wsConnEstablished = ref(false);
const store = useStore();

const channelId = 273

const connectWebSocket = async () => {
    if (ws) {
        ws.close();
    }

    messages.value = [];

    // Load initial messages from API
    const initialMessages = await getChannelMessages(store.currentChannel!.id);
    messages.value = initialMessages;

    ws = new WebSocket(`/ws/channel/${channelId}/token/${store.jwtToken}`);

    ws.onopen = () => {
        wsConnEstablished.value = true;
        ws?.send("get");
    };

    ws.onmessage = (e) => {
        const message: Message = JSON.parse(e.data);
        messages.value.push(message);
    };
};

connectWebSocket();

watch(() => channelId, () => {
    connectWebSocket();
});

onUnmounted(() => {
    if (wsConnEstablished.value && ws) {
        ws.close();
    }
});

</script>
<template>
    <div v-for="message in messages" :key="message.timestamp">
        <MessageItem
            :author="message.author"
            :timestamp="message.timestamp"
            :content-type="message.content.type"
            :content-value="message.content.value"
        />
    </div>
</template>
<style scoped>
</style>

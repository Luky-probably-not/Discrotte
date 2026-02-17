<script setup lang="ts">
import MessageItem from '@/components/messages/MessageItem.vue';
import type { Message } from '@/types';
import { ref, onUnmounted, watch, nextTick } from 'vue';
import { getChannelMessages } from '@/api/message';
import { useStore } from '@/store';

const apiBaseUrl = import.meta.env.VITE_API_URL

const messages = ref<Message[]>([]);
const hasMoreMessages = ref(true);
const currentOffset = ref(0);
let ws: WebSocket | null = null;
const wsConnEstablished = ref(false);
const store = useStore();
const messageListRef = ref<HTMLElement | null>(null);

const connectWebSocket = async () => {
    if (ws) {
        ws.close();
    }

    // Reset for new channel
    messages.value = [];
    currentOffset.value = 0;

    // Load initial messages from API
    const initialMessages = await getChannelMessages(store.currentChannel!.id, 0);
    messages.value = initialMessages;

    // Check if initial load has less than 40 = no more to load
    if (initialMessages.length < 40) {
        hasMoreMessages.value = false;
    } else {
        hasMoreMessages.value = true;
        currentOffset.value = initialMessages.length;
    }

    // Scroll to bottom
    nextTick(() => {
        if (messageListRef.value) {
            messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
        }
    });

    ws = new WebSocket(`${apiBaseUrl}/ws/channel/${store.currentChannel!.id}/token/${store.jwtToken}`);

    ws.onopen = () => {
        wsConnEstablished.value = true;
        ws?.send("get");
    };

    ws.onmessage = (e) => {
        const message: Message = JSON.parse(e.data);
        messages.value.push(message);
        // Scroll to bottom for new messages
        nextTick(() => {
            if (messageListRef.value) {
                messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
            }
        });
    };
};

// Load more older messages - PRESERVE SCROLL POSITION
const loadMoreMessages = async () => {
    const scrollHeightBefore = messageListRef.value?.scrollHeight || 0;

    const newMessages = await getChannelMessages(store.currentChannel!.id, currentOffset.value);

    // Check if less than 40 = no more to load
    if (newMessages.length < 40) {
        hasMoreMessages.value = false;
    }

    // Add to TOP of list
    messages.value.unshift(...newMessages);
    currentOffset.value += newMessages.length;

    // Restore scroll position (stay where user was)
    nextTick(() => {
        if (messageListRef.value) {
            const scrollHeightAfter = messageListRef.value!.scrollHeight;
            messageListRef.value!.scrollTop = scrollHeightAfter - scrollHeightBefore;
        }
    });
};

const reloadMessages = async () => {
    const initialMessages = await getChannelMessages(store.currentChannel!.id, 0);
    messages.value = initialMessages;

    if (initialMessages.length < 40) {
        hasMoreMessages.value = false;
    } else {
        hasMoreMessages.value = true;
        currentOffset.value = initialMessages.length;
    }
}

connectWebSocket();

watch(() => store.currentChannel!.id, () => {
    connectWebSocket();
});

onUnmounted(() => {
    if (wsConnEstablished.value && ws) {
        ws.close();
    }
});
</script>

<template>
    <section class="message-list" ref="messageListRef">
        <!-- Load More Arrow Button (shows when hasMoreMessages) -->
        <div v-if="hasMoreMessages" class="load-more-btn-container">
            <button @click="loadMoreMessages" class="load-more-btn">⬆️</button>
        </div>

        <div v-for="message in messages" :key="message.timestamp">
            <MessageItem
                :author="message.author"
                :timestamp="message.timestamp"
                :content-type="message.content.type"
                :content-value="message.content.value"
                @message-update="reloadMessages()"
            />
        </div>
    </section>
</template>

<style scoped>
.message-list {
    height: 100%;
    overflow-y: auto;
}

.load-more-btn-container {
    position: sticky;
    top: 0;
    background: white;
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid #eee;
    z-index: 10;
}

.load-more-btn {
    background: #007bff;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    font-size: 18px;
}

.load-more-btn:hover {
    background: #0056b3;
}
</style>

<script setup lang="ts">
import MessageItem from '@/components/messages/MessageItem.vue';
import type { Message } from '@/types';
import { ref, onUnmounted, watch, nextTick } from 'vue';
import { getChannelMessages } from '@/api/message';
import { useStore } from '@/store';

const apiBaseUrl = import.meta.env.VITE_API_URL

const messages = ref<Message[]>([]);
const channelName = ref<string>("")
const hasMoreMessages = ref(true);
const currentOffset = ref(0);
const showLoadMore = ref(false); // NEW: Track scroll position
let ws: WebSocket | null = null;
const wsConnEstablished = ref(false);
const store = useStore();
const messageListRef = ref<HTMLElement | null>(null);

// Watch scroll position
const handleScroll = () => {
    if (!messageListRef.value) return;

    const { scrollTop } = messageListRef.value;
    showLoadMore.value = scrollTop < 50 && hasMoreMessages.value; // Show when near top
};

const connectWebSocket = async () => {
    if (ws) {
        ws.close();
    }

    messages.value = [];
    currentOffset.value = 0;

    const initialMessages = await getChannelMessages(store.currentChannel!.id, 0);
    messages.value = initialMessages;

    if (initialMessages.length < 40) {
        hasMoreMessages.value = false;
    } else {
        hasMoreMessages.value = true;
        currentOffset.value = initialMessages.length;
    }

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
        nextTick(() => {
            if (messageListRef.value) {
                messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
            }
        });
    };
};

const loadMoreMessages = async () => {
    const scrollHeightBefore = messageListRef.value?.scrollHeight || 0;
    const newMessages = await getChannelMessages(store.currentChannel!.id, currentOffset.value);

    if (newMessages.length < 40) {
        hasMoreMessages.value = false;
    }

    messages.value.unshift(...newMessages);
    currentOffset.value += newMessages.length;

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
channelName.value = store.currentChannel!.name

watch(() => store.currentChannel!.id, () => {
    connectWebSocket();
    channelName.value = store.currentChannel!.name
});

onUnmounted(() => {
    if (wsConnEstablished.value && ws) {
        ws.close();
    }
});
</script>

<template>
    <section class="messages">
        <span class="headbar"><p>{{ channelName }}</p></span>
        <section class="message-list" ref="messageListRef" @scroll="handleScroll">

            <div v-if="showLoadMore" class="load-more-btn-container">
                <button @click="loadMoreMessages" class="load-more-btn">/\</button>
            </div>

            <div v-for="message in messages" :key="message.timestamp" class="window shadow">
                <MessageItem
                    :author="message.author"
                    :timestamp="message.timestamp"
                    :content-type="message.content.type"
                    :content-value="message.content.value"
                    @message-update="reloadMessages()"
                />
            </div>
        </section>
    </section>
</template>

<style scoped>
.messages{
    flex: 1;
}

.message-list {
    height: 100%;
    overflow-y: auto;
    padding: 10px;
}

.headbar {
    height: 40px;
}

.load-more-btn-container {
    padding: 10px;
    text-align: center;
    background: white;
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

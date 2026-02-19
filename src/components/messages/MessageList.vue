<script setup lang="ts">
import MessageItem from '@/components/messages/MessageItem.vue';
import type { Message } from '@/types';
import { ref, onUnmounted, watch, nextTick } from 'vue';
import { getChannelMessages } from '@/api/message';
import { useStore } from '@/store';

const apiBaseUrl = import.meta.env.VITE_API_URL;

// ========== STATE MANAGEMENT ==========
const messages = ref<Message[]>([]);
const channelName = ref<string>("");
const hasMoreMessages = ref(true);
const currentOffset = ref(0);
const showLoadMore = ref(false);       // Track if "Load More" button should display
let ws: WebSocket | null = null;
const wsConnEstablished = ref(false);
const store = useStore();
const messageListRef = ref<HTMLElement | null>(null);

// ========== SCROLL HANDLING ==========
// Show "Load More" button when user scrolls to top (within 50px) and more messages exist
const handleScroll = () => {
    if (!messageListRef.value) return;

    const { scrollTop } = messageListRef.value;
    showLoadMore.value = scrollTop < 50 && hasMoreMessages.value;
};

// ========== WEBSOCKET & API ==========
// Initialize WebSocket connection and fetch initial messages
const connectWebSocket = async () => {
    if (ws) {
        ws.close();
    }

    // Reset state for new channel
    messages.value = [];
    currentOffset.value = 0;

    // Fetch initial batch of messages
    const initialMessages = await getChannelMessages(store.currentChannel!.id, 0);
    messages.value = initialMessages;

    // Check if more messages exist
    if (initialMessages.length < 40) {
        hasMoreMessages.value = false;
    } else {
        hasMoreMessages.value = true;
        currentOffset.value = initialMessages.length;
    }

    // Scroll to bottom after loading initial messages
    nextTick(() => {
        if (messageListRef.value) {
            messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
        }
    });

    // Connect to WebSocket for real-time message updates
    ws = new WebSocket(`${apiBaseUrl}/ws/channel/${store.currentChannel!.id}/token/${store.jwtToken}`);

    // WebSocket handlers
    ws.onopen = () => {
        wsConnEstablished.value = true;
        // Request existing messages from WebSocket
        ws?.send("get");
    };

    // Append new messages from WebSocket and auto-scroll
    ws.onmessage = (e) => {
        const message: Message = JSON.parse(e.data);
        messages.value.push(message);

        // Auto-scroll to new message
        nextTick(() => {
            if (messageListRef.value) {
                messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
            }
        });
    };

    // Load user data to display them with each message
    await store.getUserData()
};

// ========== MESSAGE LOADING ==========
// Load older messages from history when user scrolls to top
const loadMoreMessages = async () => {
    const scrollContainer = messageListRef.value;
    if (!scrollContainer) return;

    // Store scroll position and container height before adding messages
    const scrollTopBefore = scrollContainer.scrollTop;
    const scrollHeightBefore = scrollContainer.scrollHeight;

    // Fetch next batch of older messages
    const newMessages = await getChannelMessages(store.currentChannel!.id, currentOffset.value);

    // Check if this was the last batch
    if (newMessages.length < 40) {
        hasMoreMessages.value = false;
    }

    // Prepend messages to the top of the list
    messages.value.unshift(...newMessages);
    currentOffset.value += newMessages.length;

    // Maintain scroll position by accounting for added message height
    nextTick(() => {
        const scrollContainerAfter = messageListRef.value;
        if (scrollContainerAfter) {
            // Calculate height added by new messages and adjust scroll position
            const scrollHeightAfter = scrollContainerAfter.scrollHeight;
            const addedHeight = scrollHeightAfter - scrollHeightBefore;
            scrollContainerAfter.scrollTop = scrollTopBefore + addedHeight;
        }
    });
};

// ========== MESSAGE UPDATES ==========
// Reload all messages after a message is edited
const reloadMessages = async () => {
    const initialMessages = await getChannelMessages(store.currentChannel!.id, 0);
    messages.value = initialMessages;

    // Check if more messages exist beyond initial load
    if (initialMessages.length < 40) {
        hasMoreMessages.value = false;
    } else {
        hasMoreMessages.value = true;
        currentOffset.value = initialMessages.length;
    }
};

// ========== LIFECYCLE ==========
// Initialize on component mount
connectWebSocket();
channelName.value = store.currentChannel!.name;

// Re-connect when user switches channels
watch(() => store.currentChannel!.id, () => {
    connectWebSocket();
    channelName.value = store.currentChannel!.name;
});

// Cleanup WebSocket connection on unmount
onUnmounted(() => {
    if (wsConnEstablished.value && ws) {
        ws.close();
    }
});
</script>

<template>
    <section class="messages">
        <!-- Channel name header -->
        <span class="headbar"><p>{{ channelName }}</p></span>

        <!-- Message list container with scroll listener -->
        <section class="message-list" ref="messageListRef" @scroll="handleScroll">

            <!-- "Load More" button -->
            <div v-if="showLoadMore" class="btn-bar">
                <button @click="loadMoreMessages" class="btn-style btn-popup">Load More Messages</button>
            </div>

            <!-- Render all messages -->
            <div v-for="message in messages" :key="message.timestamp" class="window shadow message" :class="{ 'own-message': message.author == store.username }">
                <MessageItem
                    :author="store.UsersData.find(u => u.username == message.author) ?? store.nullUser(message.author)"
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
    display: flex;
    flex-direction: column;
    height: 100%;
}

.message-list {
    height: 100%;
    overflow-y: auto;
    padding: 1em;
    display: flex;
    flex-direction: column;
    gap: 1em;
    background: color-mix(in srgb, var(--primary-color) 80%, black);
}

.message {
    width: 70%;
}

.own-message {
    align-self: flex-end;
}

.headbar {
    flex-shrink: 0;
    height: 40px;
}

.btn-bar {
    background: none;
}
</style>

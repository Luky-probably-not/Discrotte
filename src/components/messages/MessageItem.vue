<script setup lang="ts">
import { updateMessage } from '@/ts/messages';
import { connectedUser } from '@/ts/connectedUser';

const props = defineProps({
    contentType: String,
    contentValue: String,
    author: String,
    timestamp: Number,
});

const user = connectedUser();

const handleModerate = async () => {
    const updatedMessage = {
        channel_id: 0,
        timestamp: props.timestamp || 0,
        author: props.author || '',
        content: {
            type: props.contentType || '',
            value: props.contentValue || ''
        }
    };

    await updateMessage(user.tokenJwt, updatedMessage);
};

const formatTimestamp = (timestamp: number | undefined) => {
    if (!timestamp) return '';
    return new Date(timestamp * 1000).toLocaleString();
};
</script>

<template>
    <div class="message-item">
        <div class="message-header">
            <span class="author">{{ props.author }}</span>
            <span class="timestamp">{{ formatTimestamp(props.timestamp) }}</span>
            <button @click="handleModerate" class="moderate-btn">Moderate</button>
        </div>
        <div class="message-content">
            <div v-if="props.contentType === 'Image'" class="content-image">
                <img :src="props.contentValue" :alt="props.author" />
            </div>
            <div v-else class="content-text">
                {{ props.contentValue }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.moderate-btn {
    padding: 5px 10px;
    background-color: #ff6b6b;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 0.8em;
}

.moderate-btn:hover {
    background-color: #ff5252;
}

.message-item {
    padding: 10px;
    margin: 5px 0;
    border-bottom: 1px solid #eee;
}

.message-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
}

.author {
    font-weight: bold;
}

.timestamp {
    font-size: 0.8em;
    color: #999;
}

.message-content {
    margin-top: 5px;
}

.content-image img {
    max-width: 300px;
    border-radius: 5px;
}

.content-text {
    word-wrap: break-word;
}
</style>

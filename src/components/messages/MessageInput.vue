<script setup lang="ts">
import { ref } from 'vue';
import { createMessage } from '@/ts/messages';
import { connectedUser } from '@/ts/connectedUser';

const messageInput = ref('');
const preview = ref('');
const contentType = ref('Text');
const user = connectedUser();
const token = user.tokenJwt;
const channelId = 273;

const isValidImageUrl = async (url: string) => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        const contentType = response.headers.get('content-type');
        return contentType?.startsWith('image/') ?? false;
    } catch {
        return false;
    }
};

const handleInput = async () => {
    const trimmedInput = messageInput.value.trim();

    if (await isValidImageUrl(trimmedInput)) {
        contentType.value = 'Image';
        preview.value = trimmedInput;
    } else {
        contentType.value = 'Text';
        preview.value = '';
    }
};

const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!messageInput.value.trim()) return;

    await createMessage(token, channelId, contentType.value, messageInput.value);
    messageInput.value = '';
    preview.value = '';
    contentType.value = 'Text';
};
</script>

<template>
    <div class="message-input-container">
        <form @submit="handleSubmit">
            <input
                v-model="messageInput"
                @input="handleInput"
                type="text"
                placeholder="Type a message or paste an image URL..."
            >
            <input type="submit" value="Send">
        </form>

        <div v-if="preview" class="preview">
            <img :src="preview" :alt="messageInput" />
        </div>
    </div>
</template>

<style scoped>
.message-input-container {
    width: 100%;
}

form {
    display: flex;
    gap: 5px;
}

input[type="text"] {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

input[type="submit"] {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

input[type="submit"]:hover {
    background-color: #0056b3;
}

.preview {
    margin-top: 10px;
}

.preview img {
    max-width: 300px;
    border-radius: 5px;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { createMessage } from '@/api/message';
import { useStore } from '@/store';

const messageInput = ref('');
const preview = ref('');
const contentType = ref('Text');
const store = useStore();


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

    await createMessage(store.currentChannel!.id, contentType.value, messageInput.value);
    messageInput.value = '';
    preview.value = '';
    contentType.value = 'Text';
};
</script>

<template>
    <div class="message-input-container">
        <div v-if="preview" class="preview">
            <img :src="preview" :alt="messageInput" />
        </div>
        <form @submit="handleSubmit">
            <input
                v-model="messageInput"
                @input="handleInput"
                type="text"
                placeholder="Type a message or paste an image URL..."
            >
            <input type="submit" value="Send">
        </form>
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

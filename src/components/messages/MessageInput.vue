<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { createMessage } from '@/api/message';
import { useStore } from '@/store';

const messageInput = ref('');
const preview = ref('');
const contentType = ref('Text');
const store = useStore();
const textareaRef = ref<HTMLTextAreaElement | null>(null);

// Load draft when channel changes
watch(() => store.currentChannel?.id, (channelId) => {
    if (channelId) {
        messageInput.value = store.getDraftForChannel(channelId) ?? '';
    }
});

// Save draft on input change + auto-resize
const handleInput = async (e: Event) => {
    const textarea = e.target as HTMLTextAreaElement;
    const trimmedInput = messageInput.value.trim();

    // Save draft to store
    if (store.currentChannel) {
        store.setDraftForChannel(store.currentChannel.id, messageInput.value);
    }

    // Auto-grow textarea
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;

    if (await isValidImageUrl(trimmedInput)) {
        contentType.value = 'Image';
        preview.value = trimmedInput;
    } else {
        contentType.value = 'Text';
        preview.value = '';
    }
};

// Reset textarea height after clearing content
const resetTextareaHeight = () => {
    if (textareaRef.value) {
        textareaRef.value.style.height = 'auto';
        textareaRef.value.style.height = '40px'; // Reset to min height
    }
};

const isValidImageUrl = async (url: string) => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        const contentType = response.headers.get('content-type');
        return contentType?.startsWith('image/') ?? false;
    } catch {
        return false;
    }
};

const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!messageInput.value.trim()) return;

    await createMessage(store.currentChannel!.id, contentType.value, messageInput.value);

    // Clear draft after sending
    store.clearDraftForChannel(store.currentChannel!.id);

    messageInput.value = '';
    preview.value = '';
    contentType.value = 'Text';

    // Reset textarea height after clearing
    nextTick(resetTextareaHeight);
};

// Handle Enter key (submit on Enter, new line on Shift+Enter)
const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(new Event('submit'));
    }
};
</script>

<template>
    <div class="message-input-container">
        <div v-if="preview" class="preview">
            <img :src="preview" :alt="messageInput" />
        </div>
        <form @submit="handleSubmit">
            <textarea
                ref="textareaRef"
                v-model="messageInput"
                @input="handleInput"
                @keydown="handleKeydown"
                placeholder="Type a message or paste an image URL..."
                rows="1"
            />
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

input[type="submit"] {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    flex-shrink: 0;
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

textarea {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    min-height: 40px;
    max-height: 300px;
    resize: none;
    overflow: hidden;
    line-height: 1.4;
    font-family: inherit;
    font-size: inherit;
    box-sizing: border-box;
}

textarea:focus {
    outline: none;
    border-color: #007bff;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { updateMessage } from '@/api/message';
import { useStore } from '@/store';

const props = defineProps({
    contentType: String,
    contentValue: String,
    author: String,
    timestamp: Number,
});

const store = useStore();
const isEditing = ref(false);
const editedContent = ref(props.contentValue);
const editedContentType = ref(props.contentType);
const emit = defineEmits(['messageUpdate']);

const isValidImageUrl = async (url: string) => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        const contentType = response.headers.get('content-type');
        return contentType?.startsWith('image/') ?? false;
    } catch {
        return false;
    }
};

const handleEditInput = async () => {
    const trimmedInput = editedContent.value!.trim();

    if (await isValidImageUrl(trimmedInput)) {
        editedContentType.value = 'Image';
    } else {
        editedContentType.value = 'Text';
    }
};

const handleSaveEdit = async () => {
    const updatedMessage = {
        channel_id: store.currentChannel!.id,
        timestamp: props.timestamp || 0,
        author: props.author || '',
        content: {
            type: editedContentType.value || 'Text',
            value: editedContent.value || ''
        }
    };
    console.log(updatedMessage)
    await updateMessage(updatedMessage);
    emit('messageUpdate')
    isEditing.value = false;
};

const handleCancel = () => {
    editedContent.value = props.contentValue;
    editedContentType.value = props.contentType;
    isEditing.value = false;
};

const formatTimestamp = (timestamp: number | undefined) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString();
};

const isCreator = () => {
    return store.currentChannel?.creator === store.username;
};
</script>

<template>
    <div class="message-item">
        <div class="message-header">
            <span class="author">{{ props.author }}</span>
            <span class="timestamp">{{ formatTimestamp(props.timestamp) }}</span>
            <div class="actions">
                <button v-if="isCreator() && !isEditing" @click="isEditing = true" class="edit-btn">Edit</button>            </div>
        </div>
        <div class="message-content">
            <div v-if="!isEditing">
                <div v-if="props.contentType === 'Image'" class="content-image">
                    <img :src="props.contentValue" :alt="'Unable to load image'" />
                </div>
                <div v-else class="content-text">
                    {{ props.contentValue }}
                </div>
            </div>
            <div v-else class="edit-form">
                <div v-if="editedContentType === 'Image'" class="edit-preview">
                    <img :src="editedContent" :alt="author" />
                </div>
                <input
                    v-model="editedContent"
                    @input="handleEditInput"
                    type="text"
                    placeholder="Edit message or paste an image URL..."
                    class="edit-input"
                >
                <div class="edit-actions">
                    <button @click="handleSaveEdit" class="save-btn">Save</button>
                    <button @click="handleCancel" class="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.message-item {
    padding: 10px;
    margin: 5px 0;
    border-bottom: 1px solid #eee;
}

.message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
}

.author {
    font-weight: bold;
}

.timestamp {
    font-size: 0.8em;
    color: #999;
}

.actions {
    display: flex;
    gap: 5px;
}

.edit-btn {
    padding: 5px 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 0.8em;
}

.edit-btn:hover {
    background-color: #218838;
}

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

.edit-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.edit-input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-family: inherit;
}

.edit-preview {
    margin-top: 10px;
}

.edit-preview img {
    max-width: 300px;
    border-radius: 5px;
}

.edit-actions {
    display: flex;
    gap: 5px;
}

.save-btn {
    padding: 8px 15px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

.save-btn:hover {
    background-color: #218838;
}

.cancel-btn {
    padding: 8px 15px;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

.cancel-btn:hover {
    background-color: #5a6268;
}
</style>

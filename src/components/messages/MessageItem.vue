<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { updateMessage } from '@/api/message';
import { useStore } from '@/store';

const props = defineProps<{
    contentType: string;
    contentValue: string;
    author: string;
    timestamp: number;
}>();

const store = useStore();
const isEditing = ref(false);
const editedContent = ref('');
const editedContentType = ref('Text');
const emit = defineEmits(['messageUpdate']);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

// Configure marked for linebreaks (sync mode)
onMounted(() => {
    marked.setOptions({
        breaks: true,
        async: false
    });
});

// Markdown rendering with proper typing
const renderMarkdown = (text: string | undefined): string => {
    if (!text) return '';
    const html = marked.parse(text) as string;
    return DOMPurify.sanitize(html);
};

// Image URL validation
const isValidImageUrl = async (url: string): Promise<boolean> => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        const contentType = response.headers.get('content-type');
        return contentType?.startsWith('image/') ?? false;
    } catch {
        return false;
    }
};

// Auto-resize textarea
const resizeTextarea = (): void => {
    if (textareaRef.value) {
        textareaRef.value.style.height = 'auto';
        textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
    }
};

// Handle edit input with auto-resize
const handleEditInput = async (): Promise<void> => {
    const trimmedInput = editedContent.value.trim();

    // Auto-grow textarea immediately
    resizeTextarea();

    // Check for image URL
    if (await isValidImageUrl(trimmedInput)) {
        editedContentType.value = 'Image';
    } else {
        editedContentType.value = 'Text';
    }
};

// Enter edit mode with immediate resize
const enterEditMode = (): void => {
    editedContent.value = props.contentValue;
    editedContentType.value = props.contentType;
    isEditing.value = true;

    nextTick(() => {
        resizeTextarea(); // Immediately resize to fit content
    });
};

// Save edit
const handleSaveEdit = async (): Promise<void> => {
    const updatedMessage = {
        channel_id: store.currentChannel!.id,
        timestamp: props.timestamp || 0,
        author: props.author || '',
        content: {
            type: editedContentType.value || 'Text',
            value: editedContent.value || ''
        }
    };

    console.log(updatedMessage);
    await updateMessage(updatedMessage);
    emit('messageUpdate');
    isEditing.value = false;
};

// Cancel edit
const handleCancel = (): void => {
    isEditing.value = false;
};

// Format timestamp
const formatTimestamp = (timestamp: number | undefined): string => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString();
};

// Check if current user is creator
const isCreator = (): boolean => {
    return store.currentChannel?.creator === store.username;
};
</script>

<template>
    <div class="message-item">
        <div class="message-header">
            <span class="author">{{ props.author }}</span>
            <span class="timestamp">{{ formatTimestamp(props.timestamp) }}</span>
            <div class="actions">
                <button
                    v-if="isCreator() && !isEditing"
                    @click="enterEditMode"
                    class="edit-btn"
                    title="Edit message"
                >
                    Edit
                </button>
            </div>
        </div>

        <div class="message-content">
            <!-- Display mode -->
            <div v-if="!isEditing">
                <div v-if="props.contentType === 'Image'" class="content-image">
                    <img :src="props.contentValue" :alt="'Unable to load image'" />
                </div>
                <div v-else class="content-text">
                    <div v-html="renderMarkdown(props.contentValue)"></div>
                </div>
            </div>

            <!-- Edit mode -->
            <div v-else class="edit-form">
                <div v-if="editedContentType === 'Image'" class="edit-preview">
                    <img :src="editedContent" :alt="props.author" />
                </div>

                <textarea
                    ref="textareaRef"
                    v-model="editedContent"
                    @input="handleEditInput"
                    placeholder="Edit message or paste an image URL..."
                    class="edit-input"
                    rows="1"
                />

                <div class="edit-actions">
                    <button @click="handleSaveEdit" class="save-btn" :disabled="!editedContent.trim()">
                        Save
                    </button>
                    <button @click="handleCancel" class="cancel-btn">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.message-item {
    padding: 10px 0;
    margin: 5px 0;
    border-bottom: 1px solid #eee;
}

.message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 0.9em;
}

.author {
    font-weight: 600;
    color: #333;
}

.timestamp {
    color: #888;
    font-size: 0.8em;
}

.actions {
    display: flex;
    gap: 5px;
}

.edit-btn {
    padding: 4px 12px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8em;
    transition: background-color 0.2s;
}

.edit-btn:hover {
    background-color: #218838;
}

.message-content {
    margin-top: 5px;
}

.content-image img {
    max-width: 100%;
    max-height: 300px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.content-text {
    line-height: 1.5;
    word-wrap: break-word;
}

.content-text :deep(h1),
.content-text :deep(h2),
.content-text :deep(h3) {
    margin: 0.5em 0;
    font-size: 1.1em;
}

.content-text :deep(p) {
    margin: 0.25em 0;
}

.content-text :deep(strong) {
    font-weight: 600;
}

.content-text :deep(em) {
    font-style: italic;
}

.content-text :deep(code) {
    background: #f4f4f4;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.9em;
}

.content-text :deep(blockquote) {
    border-left: 4px solid #007bff;
    margin: 0.5em 0;
    padding-left: 1em;
    color: #666;
    font-style: italic;
}

.content-text :deep(ul),
.content-text :deep(ol) {
    padding-left: 1.5em;
    margin: 0.5em 0;
}

.content-text :deep(li) {
    margin: 0.25em 0;
}

.edit-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.edit-input {
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-family: inherit;
    font-size: inherit;
    line-height: 1.5;
    min-height: 44px;
    max-height: 300px;
    resize: none;
    overflow: hidden;
    box-sizing: border-box;
    transition: border-color 0.2s;
}

.edit-input:focus {
    outline: none;
    border-color: #007bff;
}

.edit-preview {
    margin-bottom: 8px;
}

.edit-preview img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
}

.edit-actions {
    display: flex;
    gap: 8px;
}

.save-btn, .cancel-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
    flex: 1;
}

.save-btn {
    background-color: #28a745;
    color: white;
}

.save-btn:hover:not(:disabled) {
    background-color: #218838;
}

.save-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.cancel-btn {
    background-color: #6c757d;
    color: white;
}

.cancel-btn:hover {
    background-color: #5a6268;
}
</style>

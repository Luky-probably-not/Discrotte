<script setup lang="ts">
import { onMounted, ref, nextTick, computed } from 'vue';
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

// Character limits (same as input component)
const TEXT_LIMIT = 400;
const IMAGE_LIMIT = 1000;
const isImageMode = ref(false);
const isOverLimit = ref(false);

// Computed max length for textarea
const maxLength = computed(() => isImageMode.value ? IMAGE_LIMIT : TEXT_LIMIT);

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

// Detect YouTube links
const isYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(url);
};

// Extract YouTube video ID
const getYouTubeId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    return match?.[1] ?? null;
};

// Auto-resize textarea
const resizeTextarea = (): void => {
    if (textareaRef.value) {
        textareaRef.value.style.height = 'auto';
        textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
    }
};

// Handle edit input with auto-resize + limits
const handleEditInput = async (): Promise<void> => {
    const trimmedInput = editedContent.value.trim();

    // Auto-grow textarea immediately
    resizeTextarea();

    // Check for image URL and set mode
    const isImage = await isValidImageUrl(trimmedInput);
    isImageMode.value = isImage;

    // Check limits
    isOverLimit.value = editedContent.value.length > maxLength.value;

    // Update content type
    if (isImage && !isOverLimit.value) {
        editedContentType.value = 'Image';
    } else {
        editedContentType.value = 'Text';
    }
};

// Enter edit mode with immediate resize
const enterEditMode = (): void => {
    editedContent.value = props.contentValue;
    editedContentType.value = props.contentType;
    isImageMode.value = props.contentType === 'Image';
    isOverLimit.value = false;
    isEditing.value = true;

    nextTick(() => {
        resizeTextarea(); // Immediately resize to fit content
    });
};

// Save edit
const handleSaveEdit = async (): Promise<void> => {
    if (isOverLimit.value || !editedContent.value.trim()) return;

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
    return new Date(timestamp).toLocaleString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Check if current user is creator
const isCreator = (): boolean => {
    return store.currentChannel?.creator === store.username;
};
</script>

<template>
    <section class="headbar">
        <p class="author">{{ props.author }}</p>
        <p class="timestamp">({{ formatTimestamp(props.timestamp) }})</p>
        <button
            v-if="isCreator() && !isEditing"
            @click="enterEditMode"
            class="edit-btn-style"
            title="Edit message"
        >
            <img class="edit-icon" src="https://img.icons8.com/?size=100&id=49&format=png" alt="edit"/>
        </button>
    </section>

    <section class="message-content">
        <!-- Display mode -->
        <section v-if="!isEditing">
            <div v-if="props.contentType === 'Image'" class="content-image">
                <img :src="props.contentValue" :alt="'Unable to load image'" />
            </div>
            <div v-else-if="isYouTubeUrl(props.contentValue)" class="content-youtube">
                <iframe
                    :src="`https://www.youtube.com/embed/${getYouTubeId(props.contentValue)}`"
                    frameborder="0"
                    allowfullscreen
                    class="youtube-iframe"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
            </div>
            <div v-else class="content-text">
                <div v-html="renderMarkdown(props.contentValue)"></div>
            </div>
        </section>

        <!-- Edit mode -->
        <section v-else class="edit-form">
            <div v-if="editedContentType === 'Image'" class="edit-preview">
                <img :src="editedContent" :alt="props.author" />
            </div>


            <!-- Character Counter -->
            <div v-if="editedContent" class="char-counter">
                <span :class="{ 'error': isOverLimit }">
                    {{ editedContent.length }} / {{ maxLength }}
                </span>
            </div>

            <section class="edit-section">
                <textarea
                    ref="textareaRef"
                    v-model="editedContent"
                    @input="handleEditInput"
                    placeholder="Edit message or paste an image URL..."
                    class="edit-input"
                    rows="1"
                />

                <div class="btn-bar">
                    <button
                        @click="handleSaveEdit"
                        class="btn-style save-btn "
                        :disabled="isOverLimit || !editedContent.trim()"
                    >
                        Save
                    </button>
                    <button @click="handleCancel" class="btn-style cancel-btn">
                        Cancel
                    </button>
                </div>
            </section>
        </section>
    </section>
</template>

<style scoped>

.message-content {
    margin-top: 5px;
}

.content-image img {
    max-width: 100%;
    max-height: 300px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.content-text :deep(*){
    margin: 0.5em 0.5em;
    word-wrap: break-word;
}

.content-text :deep(code) {
    background: color-mix(in srgb, var(--primary-color) 80%, black);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.9em;
}

.content-text :deep(blockquote) {
    border-left: 6px solid var(--accent-color);
    padding-left: 1em;
    font-style: italic;
}

.edit-btn-style {
    background-color: transparent;
    border: none;
    cursor: pointer;
    margin-left: auto;
}

.edit-icon {
    width: 15px;
    height: 15px;
}

.edit-form {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.edit-section {
    display: flex;
    gap: 5px;
}

.btn-bar {
    padding: 10px;
    flex-direction: column;
    gap: 8px;
}

.btn-style {
    padding: 5px 25%;
    width: 5dvw;
    min-width: 100px;
}

.edit-preview img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
}

.save-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.cancel-btn {
    background-color: #6c757d;
}

.cancel-btn:hover {
    background-color: #5a6268;
}

.headbar {
    height: 30px;
}

.author {
    font-size: 1em;
}

.timestamp {
    font-size: 0.8em;
    color: color-mix(in srgb, var(--accent-text-color) 80%, black);
    font-style: italic;
}

.content-youtube {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.youtube-iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
}

/* Character Counter */
.char-counter {
    font-size: 0.7em;
    margin-left: 15px;
    font-weight: var(--boutton-font-weight);
    color: var(--accent-text-color);
}

.char-counter .error {
    color: red;
    font-weight: bold;
}

</style>

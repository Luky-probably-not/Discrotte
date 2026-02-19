<script setup lang="ts">
import { onMounted, ref, nextTick, computed } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { updateMessage } from '@/api/message';
import { useStore } from '@/store';
import type { User } from '@/types';

// ========== PROPS & EMITS ==========
const props = defineProps<{
    contentType: string;
    contentValue: string;
    author: User;
    timestamp: number;
}>();

const store = useStore();
const emit = defineEmits(['messageUpdate']);

// ========== EDIT MODE STATE ==========
const isEditing = ref(false);
const editedContent = ref('');
const editedContentType = ref('Text');
const textareaRef = ref<HTMLTextAreaElement | null>(null);

// Character limits
const TEXT_LIMIT = 400;
const IMAGE_LIMIT = 1000;
const isImageMode = ref(false);
const isOverLimit = ref(false);

// Compute max length based on content type
const maxLength = computed(() => isImageMode.value ? IMAGE_LIMIT : TEXT_LIMIT);

// ========== INITIALIZATION ==========
// Configure markdown renderer on component mount
onMounted(() => {
    marked.setOptions({
        breaks: true,  // Convert line breaks to <br>
        async: false   // Use synchronous rendering
    });
});

// ========== RENDERING UTILITIES ==========
// Render markdown safely: parse and sanitize HTML
const renderMarkdown = (text: string | undefined): string => {
    if (!text) return '';
    const html = marked.parse(text) as string;
    return DOMPurify.sanitize(html);
};

// Validate if URL points to a valid image
const isValidImageUrl = async (url: string): Promise<boolean> => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        const contentType = response.headers.get('content-type');
        return contentType?.startsWith('image/') ?? false;
    } catch {
        return false;
    }
};

// Detect if URL is a YouTube link
const isYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(url);
};

// Extract YouTube video ID from URL
const getYouTubeId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    return match?.[1] ?? null;
};

// ========== TEXTAREA MANAGEMENT ==========
// Auto-resize textarea to fit content height
const resizeTextarea = (): void => {
    if (textareaRef.value) {
        textareaRef.value.style.height = 'auto';
        textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
    }
};

// ========== EDIT MODE HANDLERS ==========
// Handle input in edit mode: validate and resize
const handleEditInput = async (): Promise<void> => {
    const trimmedInput = editedContent.value.trim();

    // Auto-resize textarea
    resizeTextarea();

    // Validate if input is image URL and update content type
    const isImage = await isValidImageUrl(trimmedInput);
    isImageMode.value = isImage;

    // Check character limits
    isOverLimit.value = editedContent.value.length > maxLength.value;

    // Set content type based on validation
    editedContentType.value = isImage ? 'Image' : 'Text';
};

// Enter edit mode: load current message content
const enterEditMode = (): void => {
    editedContent.value = props.contentValue;
    editedContentType.value = props.contentType;
    isImageMode.value = props.contentType === 'Image';
    isOverLimit.value = false;
    isEditing.value = true;

    // Resize textarea to fit existing content
    nextTick(resizeTextarea);
};

// Save edited message to API
const handleSaveEdit = async (): Promise<void> => {
    // Validate before saving
    if (isOverLimit.value || !editedContent.value.trim()) return;

    const updatedMessage = {
        channel_id: store.currentChannel!.id,
        timestamp: props.timestamp || 0,
        author: props.author.username || '',
        content: {
            type: editedContentType.value || 'Text',
            value: editedContent.value || ''
        }
    };

    // Send update to API
    await updateMessage(updatedMessage);

    // Notify parent to reload messages
    emit('messageUpdate');

    // Exit edit mode
    isEditing.value = false;
};

// Cancel editing and discard changes
const handleCancel = (): void => {
    isEditing.value = false;
};

// ========== UTILITY FUNCTIONS ==========
// Format timestamp to readable date/time string
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

// Check if current user is channel creator
const isCreator = (): boolean => {
    return store.currentChannel?.creator === store.username;
};

</script>

<template>
    <!-- Message header: author, timestamp, edit button -->
    <section class="headbar">
        <img class="author-pic" v-bind:src="author.img"/>
        <p class="author">{{ author!.display_name }}</p>
        <p class="timestamp">({{ formatTimestamp(props.timestamp) }})</p>

        <!-- Edit button (only visible to channel creator, hidden during edit) -->
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
        <!-- DISPLAY MODE: Show rendered message content -->
        <section v-if="!isEditing">
            <!-- Image content -->
            <div v-if="props.contentType === 'Image'" class="content-image">
                <img :src="props.contentValue" :alt="'Unable to load image'" />
            </div>

            <!-- YouTube embedded video -->
            <div v-else-if="isYouTubeUrl(props.contentValue)" class="content-youtube">
                <iframe
                    :src="`https://www.youtube.com/embed/${getYouTubeId(props.contentValue)}`"
                    frameborder="0"
                    allowfullscreen
                    class="youtube-iframe"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
            </div>

            <!-- Text content -->
            <div v-else class="content-text">
                <div v-html="renderMarkdown(props.contentValue)"></div>
            </div>
        </section>

        <!-- EDIT MODE: Show editing form -->
        <section v-else class="edit-form">
            <!-- Preview for edited image URLs -->
            <div v-if="editedContentType === 'Image'" class="edit-preview">
                <img :src="editedContent" :alt="props.author.username" />
            </div>

            <!-- Character counter during edit -->
            <div v-if="editedContent" class="char-counter">
                <span :class="{ 'error': isOverLimit }">
                    {{ editedContent.length }} / {{ maxLength }}
                </span>
            </div>

            <!-- Edit textarea and control buttons -->
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
                        class="btn-style save-btn"
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
    margin-left: 5px;
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

.author-pic {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    object-fit: cover;
    border: var(--border-color);
    margin-left: 5px;
}
</style>

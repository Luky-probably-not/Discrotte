<script setup lang="ts">
import { PostChannel} from '@/api/channel';
import { ref } from 'vue';

const emit = defineEmits(['CloseAddChannel']);

const name = ref("")
const img = ref("")

const submitForm = async () => {
  await PostChannel(name.value, img.value)
  emit('CloseAddChannel');
}
</script>
<template>
    <section class="popup">
        <section class="headbar">
            <button class="close-btn" @click="emit('CloseAddChannel')">×</button>
        </section>
        <form @submit.prevent="submitForm" class="popup-form">
            <input type="text" v-model="name" placeholder="Channel Name" required />
            <input type="text" v-model="img" placeholder="Image URL" />
            <button type="submit" class="btn-style btn-submit">Create</button>
        </form>
    </section>
</template>
<style scoped>
.popup {
    width: 500px;
    height: 300px;
    border-radius: 5px;
    padding: 0 50px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: var(--box-shadow-extern);
    font-family: var(--text-font-family);
    background-color: var(--primary-color);
    border: var(--border-color);
}

.headbar {
    position: absolute;
    top: 0;
    left: 0;
  height: 50px;
}

</style>

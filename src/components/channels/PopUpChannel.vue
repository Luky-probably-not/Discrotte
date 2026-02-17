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
    <button @click="emit('CloseAddChannel')">X</button>
    <form @submit.prevent="submitForm">
        <label>Name : </label>
        <input type="text" v-model="name">
        <label>Image URL : </label>
        <input type="text" v-model="img">
        <button type="submit">+</button>
    </form>
</template>
<style scoped>
</style>

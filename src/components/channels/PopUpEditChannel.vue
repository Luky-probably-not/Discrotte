<script setup lang="ts">
import { GetChannelByID, UpdateChannel } from '@/api/channel';
import type { Channel } from '@/types';
import { ref } from 'vue';
import { useStore } from '@/store';

const store = useStore();

const inEditionProcess = ref(false);
const currentChannelInfo = ref<Channel>({
    id: 0,
    name: "",
    img: "",
    creator: "",
    theme: null,
    users: []
})

const theme

const loadChannelData = async () => {
    currentChannelInfo.value = await GetChannelByID(store.currentChannelId);
};

loadChannelData();

const switchEditionProcess = () => {
    inEditionProcess.value = !inEditionProcess.value
}

const editChanel = async () => {
    if (currentChannelInfo.value) {
        await UpdateChannel(store.currentChannelId, currentChannelInfo.value)
        switchEditionProcess();
    }
}

</script>
<template>
    <p>Pop Up Channel Component</p>
    <button @click="switchEditionProcess">Edit channel ?</button>
    <form v-if="inEditionProcess">
        <p>Channel's name</p>
        <input v-model="currentChannelInfo.name">
        <p>Channel's picture</p>
        <img v-bind:src="currentChannelInfo.img"/><br>
        <input v-model="currentChannelInfo.img"/>

        <!-- Theme fields inline -->
        <p>Themes</p>
        <label>Primary color</label>
        <input v-model="currentChannelInfo.theme.primary_color"/>

        <label>Primary color dark</label>
        <input v-model="currentChannelInfo.theme.primary_color_dark"/>

        <label>Accent color</label>
        <input v-model="currentChannelInfo.theme.accent_color"/>

        <label>Text color</label>
        <input v-model="currentChannelInfo.theme.text_color"/>

        <label>Accent text_color</label>
        <input v-model="currentChannelInfo.theme.accent_text_color"/>
    </form>
    <button @click="editChanel">Edit channel</button>
</template>
<style scoped>
img {
    width: 200px;
    height: 150px;
}
</style>

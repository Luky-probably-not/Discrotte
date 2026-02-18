<script setup lang="ts">
import { UpdateChannel } from '@/api/channel';
import PopUpDeleteChannel from '@/components/channels/PopUpDeleteChannel.vue'
import { useStore } from '@/store';
import type { Theme } from '@/types';
import { computed, ref, watch } from 'vue';

const store = useStore();

const emit = defineEmits(["closeEdition"])

let currentChannelInfo = store.currentChannel!;

let InDeletionProcess = ref(false);
const currentTheme = ref<Theme>();

const currentChannelWatcher = computed(() => {
    return store.currentChannel!
})

watch(
    currentChannelWatcher,
    () => {
        reloadChannel();
    })

const switchEditionProcess = () => {
    reloadChannel();
}

const editChanel = async () => {
    currentChannelInfo.theme = currentTheme.value
    await UpdateChannel(store.currentChannel!.id, currentChannelInfo)
    switchEditionProcess();
    emit("closeEdition")
}

const reloadChannel = () => {
    currentChannelInfo = store.currentChannel!;
    InDeletionProcess.value = false
    loadCurrentTheme()
}

const loadCurrentTheme = () => {
    const rootStyles = getComputedStyle(document.documentElement);
    currentTheme.value = currentChannelInfo.theme ??
        {
            primary_color : rootStyles.getPropertyValue('--primary-color'),
            primary_color_dark : rootStyles.getPropertyValue('--primary-color-dark'),
            accent_color : rootStyles.getPropertyValue('--accent-color'),
            text_color : rootStyles.getPropertyValue('--text-color'),
            accent_text_color : rootStyles.getPropertyValue('--accent-text-color')
        };
}
loadCurrentTheme();

</script>
<template>
    <section class="popup">
        <section class="popup-headbar">
            <p class="name">Edit Channel</p>
            <button class="close-btn" @click="$emit('closeEdition')">x</button>
        </section>
        <section v-if="InDeletionProcess == false">
            <form @submit.prevent="editChanel()" class="popup-form">
                <section class="popup-body">
                    <span class="image-circle">
                        <img v-bind:src="currentChannelInfo.img"/><br>
                    </span>
                    <section class="inputs-container">
                        <input v-model="currentChannelInfo.name" type="text"/>
                        <input v-model="currentChannelInfo.img" type="text"/>
                        <button type="submit">Update</button>
                    </section>

                    <section class="theme-container">
                        <section class="theme">
                            <input type="color" v-model="currentTheme!.primary_color"/>
                            <text>Primary Color</text>
                        </section>
                        <section class="theme">
                            <input type="color" v-model="currentTheme!.primary_color_dark"/>
                            <text>Primary Color (Dark theme)</text>
                        </section>
                        <section class="theme">
                            <input type="color" v-model="currentTheme!.accent_color"/>
                            <text>Accent color</text>
                        </section>
                        <section class="theme">
                            <input type="color" v-model="currentTheme!.accent_text_color"/>
                            <text>Accent Text color</text>
                        </section>
                        <section class="theme">
                            <input type="color" v-model="currentTheme!.text_color"/>
                            <text>Text color</text>
                        </section>
                    </section>
                </section>
            </form>
        </section>
        <button v-if="InDeletionProcess == false" @click="InDeletionProcess = true" class="delete-button">Delete channel</button>
        <section v-if="InDeletionProcess" class="overlay">
            <PopUpDeleteChannel
                @close-popup="InDeletionProcess = false"/>
        </section>
    </section>
</template>
<style scoped>
.popup {
    width: 1100px;
    height: 600px;
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

.popup-body {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.popup-form .image-circle {
  width: 400px;
  height: 400px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
}

.popup-form .image-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.inputs-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
  margin-top: 10dvh;
}

.theme-container {
    display: flex;
    flex-direction: column;
    padding: 15px;
    flex: 1;
}

.theme-container .theme {
    padding: 10px;
}

.theme-container text {
    padding: 8px 10px;
    font-family: var(--text-font-family);
    font-size: 1em;
}

.theme-container input {
  border-radius: 5px;
  border: var(--border-color);
}

.inputs-container input {
  padding: 8px 10px;
  border-radius: 5px;
  border: var(--border-color);
  font-family: var(--text-font-family);
  font-size: 1em;
}

.inputs-container button {
  padding: 10px 15px;
  border-radius: 5px;
  border: var(--border-color);
  background-color: var(--accent-color);
  font-weight: var(--boutton-font-weight);
  cursor: pointer;
  font-family: var(--text-font-family);
}

.delete-button {
    padding: 10px 15px;
    border-radius: 5px;
    border: var(--border-color);
    font-weight: var(--boutton-font-weight);
    cursor: pointer;
    font-family: var(--text-font-family);
    background-color : red;
    box-shadow: var(--box-shadow-intern);
    font-size: medium;
}
</style>

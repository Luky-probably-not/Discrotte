<script setup lang="ts">
import { UpdateChannel } from '@/api/channel';
import { useStore } from '@/store';
import { computed, watch } from 'vue';

const store = useStore();

const emit = defineEmits(["closeEdition"])

let currentChannelInfo = store.currentChannel!;

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
    await UpdateChannel(store.currentChannel!.id, currentChannelInfo)
    switchEditionProcess();
    emit("closeEdition")
}

const reloadChannel = () => {
    currentChannelInfo = store.currentChannel!;
}


</script>
<template>
    <button @click="emit('closeEdition')">X</button>
    <form>
        <p>Channel's name</p>
        <input v-model="currentChannelInfo.name">
        <p>Channel's picture</p>
        <img v-bind:src="currentChannelInfo.img"/><br>
        <input v-model="currentChannelInfo.img"/>

        <p>Themes</p>
        <label>Primary color</label>
        <div v-if="currentChannelInfo.theme != undefined">
            <input v-model="currentChannelInfo.theme.primary_color"/>
        </div>
        <div v-else>
            <input/>
        </div>
        <label>Primary color dark</label>
        <div v-if="currentChannelInfo.theme != undefined">
            <input v-model="currentChannelInfo.theme.primary_color_dark"/>
        </div>
        <div v-else>
            <input/>
        </div>
        <label>Accent color</label>
        <div v-if="currentChannelInfo.theme != undefined">
            <input v-model="currentChannelInfo.theme.accent_color"/>
        </div>
        <div v-else>
            <input/>
        </div>
        <label>Text color</label>
        <div v-if="currentChannelInfo.theme != undefined">
            <input v-model="currentChannelInfo.theme.text_color"/>
        </div>
        <div v-else>
            <input/>
        </div>
        <label>Accent text_color</label>
        <div v-if="currentChannelInfo.theme != undefined">
            <input v-model="currentChannelInfo.theme.accent_text_color"/>
        </div>
        <div v-else>
            <input/>
        </div>
        <button @click="editChanel">Edit channel</button>
    </form>
</template>
<style scoped>
img {
    width: 200px;
    height: 150px;
}
</style>

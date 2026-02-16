<script setup lang="ts">
import { GetChannelByID, UpdateChannel } from '@/ts/channel';
import { ChannelInfo } from '@/ts/domain/channel';
import { Theme } from '@/ts/domain/theme';
import { ref } from 'vue';
import ThemeEditor from './ThemeEditor.vue';


const props = defineProps({
    tokenJwt : String,
    channelId : Number
})

const inEditionProcess = ref(false);
const currentChanel = ref(new ChannelInfo);
const theme = ref(new Theme);
const switchEditionProcess = () => {
    inEditionProcess.value = !inEditionProcess.value
}

const setupChanel = async () => {
    currentChanel.value = await GetChannelByID(props.tokenJwt!,props.channelId!);    
    theme.value = currentChanel.value.theme;
}

const editChanel = async () => {
    await UpdateChannel(props.tokenJwt!, props.channelId!,currentChanel.value)
    theme.value = currentChanel.value.theme;
    switchEditionProcess();
}

setupChanel();

</script>
<template>
    <p>Pop Up Channel Component</p>
    <button @click="switchEditionProcess">Edit channel ?</button>
    <form v-if="inEditionProcess">
        <p>Channel's name</p>
        <input v-model="currentChanel.name">
        <p>Channel's picture</p>
        <img v-bind:src="currentChanel.img"/><br>
        <input v-model="currentChanel.img"/>
        <ThemeEditor :theme="currentChanel.theme"/>
    </form>
    <button @click="editChanel">Edit channel</button>
</template>
<style scoped>
img {
    width: 200px;
    height: 150px;
}
</style>
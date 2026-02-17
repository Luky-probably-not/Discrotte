<script setup lang="ts">
import { addUserToChannel } from '@/api/user';
import { useStore } from '@/store';
import { ref } from 'vue';

const store = useStore();

const userName = ref("")

const addUser = async () => {
    if (userName.value == undefined || userName.value == "")
    {
        console.log("userName null");
        return;
    }
    await addUserToChannel(userName.value, store.currentChannel!.id)
    document.getElementById('userName')!.value = "";
}

</script>
<template>
    <input id="userName" type="text" v-model="userName">
    <button @click="addUser">addUser</button>
</template>
<style scoped>
</style>

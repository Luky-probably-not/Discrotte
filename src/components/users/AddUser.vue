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
    if (store.currentChannel == undefined || store.currentChannel.id == -1)
    {
        console.log("password null");
        return;
    }
    await addUserToChannel(userName.value, store.currentChannel.id)
}

</script>
<template>
    <p>Add User Component</p>
    <input type="text" v-model="userName">
    <button @click="addUser">addUser</button>
</template>
<style scoped>
</style>

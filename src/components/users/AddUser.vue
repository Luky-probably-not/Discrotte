<script setup lang="ts">
import LoginUser from '@/components/users/LoginUser.vue';
import { connectedUser } from '@/ts/connectedUser';
import { addUserToChannel } from '@/ts/users';
import { ref } from 'vue';

const channelId = ref(-1)
const userName = ref("")

const user = connectedUser();

const addUser = async () => {
    if (userName.value == undefined || userName.value == "")        
    {
        console.log("userName null");
        return;
    }    
    if (channelId.value == undefined || channelId.value == -1)
    {
        console.log("password null");
        return;
    }   
    await addUserToChannel(user.tokenJwt, userName.value, channelId.value)
}

</script>
<template>
    <p>Add User Component</p>
    <LoginUser />
    <input type="integer" v-model="channelId">
    <input type="text" v-model="userName">
    <button @click="addUser">addUser</button>
</template>
<style scoped>
</style>
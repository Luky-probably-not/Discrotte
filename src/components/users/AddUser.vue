<script setup lang="ts">
import { addUserToChannel } from '@/ts/users';
import { ref } from 'vue';
const props = defineProps({
    tokenJwt : String,
    channelId : Number
})
const userName = ref("")

const addUser = async () => {
    if (userName.value == undefined || userName.value == "")        
    {
        console.log("userName null");
        return;
    }    
    if (props.channelId! == undefined || props.channelId! == -1)
    {
        console.log("password null");
        return;
    }   
    await addUserToChannel(props.tokenJwt!, userName.value, props.channelId!)
}

</script>
<template>
    <p>Add User Component</p>
    <input type="text" v-model="userName">
    <button @click="addUser">addUser</button>
</template>
<style scoped>
</style>
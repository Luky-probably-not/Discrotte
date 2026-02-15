<script setup lang="ts">
import { connectedUser } from '@/ts/connectedUser';
import { login } from '@/ts/users';
import { ref } from 'vue';

const userName = ref("")
const password = ref("")

const user = connectedUser()

const loginUser = async () => {
    if (userName.value == undefined || userName.value == "")        
    {
        console.log("userName null");
        return;
    }    
    if (password.value == undefined || password.value == "")
    {
        console.log("password null");
        return;
    }   
    let token = await login(userName.value,password.value)
    user.addUser(token, userName.value)
    console.log(user.tokenJwt)
    console.log(user.userName)
}
</script>

<template>
    <form >
        <label>Username : </label>
        <input type="text" v-model="userName">
        <label>Password : </label>
        <input type="text" v-model="password">
    </form>
    <button @click="loginUser">+</button>
</template>


<style scoped>
</style>
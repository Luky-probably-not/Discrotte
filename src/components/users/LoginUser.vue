<script setup lang="ts">
import { login } from '@/api/auth';
import { ref } from 'vue';

import { useRouter } from 'vue-router'
import { useStore } from '@/store';

const router = useRouter()
const userName = ref("")
const password = ref("")

const store = useStore();

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
    const token = await login(userName.value,password.value)
    store.setAuthInfo(userName.value, token,);
    console.log(token);
    if (token && token !== "") {
        router.push({ name: "home" })
    }
}
</script>

<template>
    <form @submit.prevent="loginUser">
        <label>Username : </label>
        <input type="text" v-model="userName">

        <label>Password : </label>
        <input type="password" v-model="password">

        <button type="submit">+</button>
    </form>
</template>


<style scoped>
</style>

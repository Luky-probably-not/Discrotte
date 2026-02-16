<script setup lang="ts">
import { connectedUser } from '@/ts/connectedUser';
import { login } from '@/ts/users';
import { ref } from 'vue';

const props = defineProps({
    token : String,
    store : connectedUser
})
import { useRouter } from 'vue-router'

const router = useRouter()
const userName = ref("")
const password = ref("")

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
    props.store!.addUser(token,userName.value);
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
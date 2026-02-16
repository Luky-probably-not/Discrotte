<script setup lang="ts">
import { AddChannel, PrintPopUpChannel} from '@/ts/channel';
import { connectedUser } from '@/ts/connectedUser';
import { ref } from 'vue';

const user = connectedUser()
const name = ref("")
const img = ref("")

const submitForm = async () => {
  await AddChannel(user.tokenJwt, name.value, img.value)
  PrintPopUpChannel.value = false
}
</script>
<template>
    <button @click="PrintPopUpChannel = !PrintPopUpChannel">X</button>
    <form @submit.prevent="submitForm">
        <label>Name : </label>
        <input type="text" v-model="name">
        <label>Image URL : </label>
        <input type="text" v-model="img">
        <button type="submit">+</button>
    </form>
</template>
<style scoped>
</style>
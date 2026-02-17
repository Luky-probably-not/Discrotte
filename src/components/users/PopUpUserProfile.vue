<script setup lang="ts">
    import { showProfile, UpdateUser, getOneUserByName } from '@/api/user';
    import { useStore } from '@/store';
    import type { User } from '@/types';
    import { ref, onMounted } from "vue"

    const store = useStore();

    const userInfo = ref<User>({
        username: '',
        display_name: '',
        img: '',
        status: ''
    })
    onMounted(async () => {
        userInfo.value = await getOneUserByName(store.username)
    })
    const update = async () => {
        await UpdateUser(userInfo.value);
        showProfile.value = !showProfile.value;
    }
</script>
<template>
    <button @click="showProfile = !showProfile">+</button>
    <form @submit.prevent="update()">
        <input v-model="userInfo.display_name" />
        <p>{{ userInfo.username }}</p>
        <img :src="userInfo.img" alt="user picture" />
        <input v-model="userInfo.img" />
        <input v-model="userInfo.status" />
        <button type="submit">Update</button>
    </form>
</template>
<style scoped>
</style>

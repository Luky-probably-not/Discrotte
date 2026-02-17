<script setup lang="ts">
    import { UpdateUser, getOneUserByName } from '@/api/user';
    import { useStore } from '@/store';
    import type { User } from '@/types';
    import { ref, onMounted } from "vue"

    const store = useStore();
    const emit = defineEmits<{
        close: []
    }>();

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
        emit('close');
    }
</script>
<template>
    <button @click="$emit('close')">+</button>
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

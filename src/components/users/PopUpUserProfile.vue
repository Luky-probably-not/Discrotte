<script setup lang="ts">
    import { UpdateUser, getOneUserByName } from '@/api/user';
    import { useStore } from '@/store';
    import type { User } from '@/types';
    import { ref, onMounted } from "vue"

    const store = useStore();
    const emit = defineEmits(['closeProfile']);

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
        emit('closeProfile');
    }
</script>
<template>
    <section class="popup">
        <section class="headbar">
            <p class="name">{{ userInfo.username }}</p>
            <button class="close-btn" @click="$emit('closeProfile')">×</button>
        </section>
        <form @submit.prevent="update()" class="popup-form">
            <section class="popup-body">
                <span class="image-circle">
                    <img :src="userInfo.img" alt="user picture" />
                </span>
                <section class="inputs-container">
                    <input v-model="userInfo.display_name" type="text"/>
                    <input v-model="userInfo.img" type="text" />
                    <input v-model="userInfo.status" type="text" />
                    <button type="submit" class="btn-style btn-submit">Update</button>
                </section>
            </section>
        </form>
    </section>
</template>
<style scoped>
.popup {
    width: 1000px;
    height: 600px;
    border-radius: 5px;
    padding: 0 50px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: var(--box-shadow-extern);
    font-family: var(--text-font-family);
    background-color: var(--primary-color);
    border: var(--border-color);
}

.popup-body {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.popup-form .image-circle {
  width: 400px;
  height: 400px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
}

.popup-form .image-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.inputs-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
  margin-top: 10dvh;
}

.inputs-container input {
  padding: 8px 10px;
  border-radius: 5px;
  border: var(--border-color);
  font-family: var(--text-font-family);
  font-size: 1em;
}

.inputs-container button {
  padding: 10px 15px;
  border-radius: 5px;
  border: var(--border-color);
  background-color: var(--accent-color);
  font-weight: var(--boutton-font-weight);
  cursor: pointer;
  font-family: var(--text-font-family);
}
.headbar {
    position: absolute;
    top: 0;
    left: 0;
    height: 50px;
}
</style>

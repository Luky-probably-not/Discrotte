<script setup lang="ts">
import { addUserToChannel } from '@/api/user';
import { useStore } from '@/store';
import { ref } from 'vue';

defineProps({
    isCreator:Boolean
})

const store = useStore();


const userName = ref("")

// Ajoute un utilisateur au channel
const addUser = async () => {
    if (userName.value == undefined || userName.value == "")
    {
        console.log("userName null");
        return;
    }
    await addUserToChannel(userName.value, store.currentChannel!.id)
    document.getElementById('userName')!.value = ""; //ESLint déclare une erreur, mais aucun problème à l'execution
}

</script>
<template>
    <section class="add-user">
        <div v-if="isCreator">
            <form @submit.prevent="addUser" class="popup-form">
                <input id="userName" type="text" v-model="userName" placeholder="Username">
                <button @click="addUser" class="add-btn btn-style btn-submit">addUser</button>
            </form>
        </div>
    </section>
</template>
<style scoped>

.add-user {
    display: flex;
    flex: row;
    padding: 20px;
}

.popup-form {
    flex-direction: row;
}

</style>

<script setup lang="ts">
import { addUserToChannel } from '@/api/user';
import { useStore } from '@/store';
import { ref } from 'vue';

defineProps({
    isCreator:Boolean
})

const store = useStore();


const userName = ref("")

const addUser = async () => {
    if (userName.value == undefined || userName.value == "")
    {
        console.log("userName null");
        return;
    }
    await addUserToChannel(userName.value, store.currentChannel!.id)
    document.getElementById('userName')!.value = "";
}

</script>
<template>
    <section class="add-user">
        <div v-if="isCreator">
            <input id="userName" type="text" v-model="userName">
            <button @click="addUser" class="add-user-button">addUser</button>
        </div>
    </section>
</template>
<style scoped>

.add-user {
    display: flex;
    flex: row;
    padding: 20px;
}

.add-user input {
    border-radius: 5px;
    border: var(--border-color);
    font-family: var(--text-font-family);
    font-size: 1em;

}

.add-user-button {
    margin-left: 25px;
    padding: 4px 15px;
    background-color: lightgreen;
    color: black;
    border-radius: 5px;
    border : 20px;
    border-color: red;
    font-size: 0.8em;
    cursor: pointer;
}
</style>

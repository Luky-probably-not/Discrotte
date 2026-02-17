<script setup lang="ts">
import { useStore } from '@/store';
import { computed, ref, watch } from 'vue';
import { DeleteChannel } from '@/api/channel';
const store = useStore();

const emit= defineEmits(["closePopup"])

let currentChannelInfo = store.currentChannel!;


const currentChannelWatcher = computed(() => {
    return store.currentChannel!
})

const confirm = ref(false);

const deleteChannel = async () => {
    if (confirm.value){
        await DeleteChannel(currentChannelInfo.id)
        emit('closePopup')
        store.currentChannel = null;
    }
}

watch(
    currentChannelWatcher,
    () => {
        reloadChannel()
    }
)

const reloadChannel = () => {
    currentChannelInfo = store.currentChannel!;
}
</script>
<template>
    <section class="popup">

        <section class="popup-headbar">
            <p class="name">Delete channel</p>
            <button class="close-btn" @click="$emit('closePopup')">x</button>
            <form class="popup-form" @submit.prevent="deleteChannel()">
                <section class="popup-body">
                    <span class="image-circle">
                        <img v-bind:src="currentChannelInfo.img"/><br>
                    </span>
                    <section class="inputs-container">
                        <p>Delete channel ?</p>
                        <input type="checkbox" id="checkbox" v-model="confirm"/>
                        <label for="checkbox">Confirm deletion</label>
                        <button type="submit">Delete</button>
                    </section>
                </section>
            </form>
        </section>
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
</style>

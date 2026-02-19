<script setup lang="ts">
import InfoChannel from '@/components/channels/InfoChannel.vue';
import PopUpDeleteChannel from '@/components/channels/PopUpDeleteChannel.vue';
import PopUpEditChannel from '@/components/channels/PopUpEditChannel.vue';
import AddUser from '@/components/users/AddUser.vue';
import { useStore } from '@/store';
import { computed, ref, watch } from 'vue';

const store = useStore();

const InEditingProcess = ref(false);
const isCreator = ref(false);

const channelWatcher = computed(() => store.currentChannel!)

watch(
    channelWatcher,
    () => loadCreatorCheck()
)

const loadCreatorCheck = async () => {
    isCreator.value =store.username == store.currentChannel!.creator
    InEditingProcess.value = false;
}

loadCreatorCheck()

</script>
<template>
    <section class="right-panel">
        <section class="channel-info window shadow">
            <section class="headbar"></section>
            <img v-bind:src="store.currentChannel!.img">
            <article v-if="isCreator" class="mod-options">
                <section class="edit-channel">
                    <button @click="InEditingProcess = true" class="btn-style btn-popup">Edit channel</button>
                    <section v-if="InEditingProcess" class="overlay">
                        <PopUpEditChannel
                            @close-edition="InEditingProcess = false"/>
                    </section>
                </section>
                <AddUser :is-creator="isCreator" class="add-user"/>
            </article>
        </section>
        <section class="channel-users window shadow">
            <InfoChannel :is-creator="isCreator" class="bottom"/>
        </section>
    </section>
</template>
<style scoped>

.right-panel {
    display: flex;
    flex-direction: column;
    gap:15px;
    max-height: 95vh;
    width: 100%;
    overflow: hidden;
}

.channel-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 50vh;
}

.channel-users {
    max-height: 45vh;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 1000;
}
.edit-channel {
    padding: 10px;
    padding-left: 50px;
    flex-shrink: 0;
}

.edit-button {
    padding: 4px 12px;
    background-color: orange;
    color: white;
    border: black;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.8em;
    transition: background-color 0.2s;
}
button {
  height: auto;
}
.headbar {
    flex-shrink: 0;
    height: 20px;
}

.add-user {
    padding-left: 50px;
}

.right-panel img {
    align-items: center;
    padding: 5px;
    max-height: 200px;
    max-width: 97%;
    width: auto;
    height: auto;

    object-fit: contain;
}


.bottom {
    min-height: 0;
}
</style>

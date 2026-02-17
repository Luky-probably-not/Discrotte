<script setup lang="ts">
import InfoChannel from '@/components/channels/InfoChannel.vue';
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
    <img v-bind:src="store.currentChannel!.img">
    <article v-if="isCreator" class="toolbar">
        <button @click="InEditingProcess = true">Edit channel ?</button>
        <section v-if="InEditingProcess" class="overlay">
            <PopUpEditChannel
                @close-edition="InEditingProcess = false"/>
        </section>
    </article>
    <AddUser :is-creator="isCreator"/>
    <InfoChannel :is-creator="isCreator"/>
</template>
<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 1000;
}
.toolbar {
  display: flex;
  align-items: flex-start;
}

button {
  height: auto;
}

img {
    width: auto;
    height:100%;
    max-height: 300px;
    max-width: 350px;
}
</style>

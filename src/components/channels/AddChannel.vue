<script setup lang="ts">
    import PopUpChannel from '@/components/channels/PopUpChannel.vue';
    import { ref } from 'vue';

    const ShowAddChannel = ref(false);
</script>
<template>
    <button @click="ShowAddChannel = !ShowAddChannel">New Channel</button>
    <div v-if="ShowAddChannel" class="overlay">
        <PopUpChannel @CloseAddChannel="ShowAddChannel = false"/>
    </div>
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
</style>

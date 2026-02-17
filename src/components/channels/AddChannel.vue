<script setup lang="ts">
    import PopUpChannel from '@/components/channels/PopUpChannel.vue';
    import { ref } from 'vue';

    const ShowAddChannel = ref(false);
</script>
<template>
    <article class="toolbar">
        <button @click="ShowAddChannel = !ShowAddChannel">New Channel</button>
    </article>
    <section v-if="ShowAddChannel" class="overlay">
        <PopUpChannel @CloseAddChannel="ShowAddChannel = false"/>
    </section>
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
</style>

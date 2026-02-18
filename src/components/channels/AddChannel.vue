s<script setup lang="ts">
    import PopUpChannel from '@/components/channels/PopUpChannel.vue';
    import { ref } from 'vue';

    const ShowAddChannel = ref(false);
</script>
<template>
    <section class="headbar"></section>
    <article class="btn-bar">
        <button @click="ShowAddChannel = !ShowAddChannel" class="btn-style btn-popup">New Channel</button>
    </article>
    <section v-if="ShowAddChannel" class="overlay">
        <PopUpChannel @CloseAddChannel="ShowAddChannel = false"/>
    </section>
    <section v-else>
    </section>
</template>
<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.2);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 1000;
}

.btn-bar {
    padding: 10px;
}

.headbar {
    flex-shrink: 0;
    height: 20px;
}
</style>

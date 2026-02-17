<script setup lang="ts">
    import PopUpChannel from '@/components/channels/PopUpChannel.vue';
    import { ref } from 'vue';

    const ShowAddChannel = ref(false);
</script>
<template>
    <button @click="ShowAddChannel = !ShowAddChannel">+</button>
    <PopUpChannel v-if="ShowAddChannel" @CloseAddChannel="ShowAddChannel = false"/>
</template>
<style scoped>
</style>

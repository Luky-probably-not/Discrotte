<script setup lang="ts">
import PopUpChannel from '@/components/channels/PopUpChannel.vue';
import { PrintPopUpChannel } from '@/ts/channel';
</script>
<template>
    <button @click="PrintPopUpChannel = !PrintPopUpChannel">+</button>
    <PopUpChannel v-if="PrintPopUpChannel" />
</template>
<style scoped>
</style>
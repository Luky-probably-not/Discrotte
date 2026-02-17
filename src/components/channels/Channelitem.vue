<script setup lang="ts">
import { useStore } from "@/store";
import { type Channel } from "@/types";
const store = useStore();

defineProps<{
    channel: Channel
}>()
</script>

<template>
    <div class="channel-item" @click="store.currentChannel! = channel">
        <p>{{ channel.name }}</p>
        <img :src="channel.img" alt="channel picture" />
    </div>
</template>

<style scoped></style>

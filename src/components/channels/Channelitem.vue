<script setup lang="ts">
    import {selectedChannelID} from "@/ts/channel"
    import { type ChannelInfo } from "@/ts/domain/channel"

    defineProps<{channel: ChannelInfo}>()
</script>

<template>
    <div class="channel-item" @click="selectedChannelID = channel.id">
        <p>{{ channel.name }}</p>
        <img :src="channel.img" alt="channel picture" />
    </div>
</template>

<style scoped></style>
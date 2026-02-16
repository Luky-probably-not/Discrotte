<script setup lang="ts">
    import {type Channel,selectedChannelID} from "@/ts/channels"

    defineProps<{channel: Channel}>()
</script>

<template>
    <div class="channel-item" @click="selectedChannelID = channel.id">
        <p>{{ channel.name }}</p>
        <img :src="channel.img" alt="channel picture" />
    </div>
</template>
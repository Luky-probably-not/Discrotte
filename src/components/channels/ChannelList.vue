<script setup lang="ts">
import Channelitem from '@/components/channels/ChannelItem.vue';

import {GetChannelByUser} from "@/api/channel"

import {onMounted} from "vue"

import { useStore } from "@/store";

const store = useStore();

onMounted(async () => {
    store.userChannels = await GetChannelByUser()
})

</script>
<template>
    <section class="channel-list">
        <article v-for="channel in store.userChannels" :key="channel.id">
            <Channelitem :channel="channel" />
        </article>

  </section>

</template>
<style scoped>
    .channel-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-color: var(--primary-color);
        height: 100%;
        overflow-y: auto;
        padding-bottom: 5px;
    }
    
    .channel-list::-webkit-scrollbar {
        width: 6px;
    }

    .channel-list::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.2);
        border-radius: 4px;
    }
</style>

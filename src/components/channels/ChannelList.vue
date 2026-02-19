<script setup lang="ts">
import Channelitem from '@/components/channels/ChannelItem.vue';
import {GetChannelByUser} from "@/api/channel"
import {onMounted} from "vue"
import { useStore } from "@/store";

// Get the store to update the user channels list when the component is mounted
const store = useStore();

// When the component is mounted, fetch the channels for the user and update the store
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

<script setup lang="ts">
    import Channelitem from '@/components/channels/Channelitem.vue';

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
    gap: 4px; 
    }
</style>
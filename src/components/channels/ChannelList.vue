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
    <div v-for="channel in store.userChannels" :key="channel.id">
        <Channelitem :channel="channel" />
    </div>

</template>
<style scoped>
</style>
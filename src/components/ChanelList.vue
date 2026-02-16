<script setup lang="ts">
    import AddChannel from '@/components/channels/AddChannel.vue';
    import Channelitem from '@/components/channels/Channelitem.vue';
    import {GetChannelByUser,type Channel} from "@/ts/channels"

    import { ref, onMounted, type Ref } from "vue"

    const channels: Ref<Channel[]> = ref([])

    onMounted(async () => {
        channels.value = await GetChannelByUser()
    })

</script>
<template>
    <AddChannel />
    <div v-for="channel in channels" :key="channel.id">
        <Channelitem :channel="channel" />
    </div>

    
</template>
<style scoped>
</style>
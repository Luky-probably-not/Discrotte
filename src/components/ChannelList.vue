<script setup lang="ts">
    import AddChannel from '@/components/channels/AddChannel.vue';
    import Channelitem from '@/components/channels/Channelitem.vue';
    
    import {GetChannelByUser,channels} from "@/ts/channel"

    import { connectedUser } from "@/ts/connectedUser"

    import {onMounted} from "vue"

    const user = connectedUser()

    onMounted(async () => {
        channels.value = await GetChannelByUser(user.tokenJwt)
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
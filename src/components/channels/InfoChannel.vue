<script setup lang="ts">
    import {GetChannelByID, type Channel,selectedChannelID} from "@/ts/channels"

    import { ref,watch, type Ref } from "vue"
   
    const infoChannel: Ref<Channel | null> = ref(null)

    watch(selectedChannelID, async (newID) => {
        if (newID !== null) {
            infoChannel.value = await GetChannelByID(newID)
        }
    })
</script>
<template>
    <div v-if="infoChannel">
        <h2>Détails du channel :</h2>
        <p>{{infoChannel.id}} </p>
        <p>{{ infoChannel.name }}</p>
        <img :src="infoChannel.img" alt="channel picture" />
        <p>Users : {{ infoChannel.users.join(", ") }}</p>
        <p>{{infoChannel.theme}} </p>
    </div>
</template>
<style scoped>
</style>
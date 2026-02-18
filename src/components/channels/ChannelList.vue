<script setup lang="ts">
import Channelitem from '@/components/channels/Channelitem.vue';

import {GetChannelByUser} from "@/api/channel"

import {computed, onMounted, watch} from "vue"

import { useStore } from "@/store";

const store = useStore();

const channelWatcher = computed(() => store.userChannels)

watch(
    channelWatcher,
    () => loadChannel()
)

const loadChannel = async () => {
    store.userChannels = await GetChannelByUser()
}

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

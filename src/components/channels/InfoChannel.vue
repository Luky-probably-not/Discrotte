<script setup lang="ts">
import { getOneUserByName } from '@/api/user';
import { useStore } from '@/store';
import { computed, ref, watch, type Ref } from 'vue';

const store = useStore();

const channelUsers : Ref<Array<string>, Array<string>> = ref([]);

const currentChannelWatcher = computed(() => store.currentChannel!)

watch(
    currentChannelWatcher,
    () => loadChannelUsers()
)

const loadChannelUsers = async () =>{
    channelUsers.value = store.currentChannel!.users;
    for (let idx = 0; idx < channelUsers.value.length; idx++){
        const displayedName = await getOneUserByName(channelUsers.value[idx]!)
        channelUsers.value[idx] = displayedName?.display_name ?? channelUsers.value[idx];
    }
}

loadChannelUsers();

</script>
<template>
    <h1>Channels users</h1>
    <li>
        <div v-for="user of channelUsers" :key="user">{{ user }}</div>
    </li>
</template>
<style scoped>
</style>

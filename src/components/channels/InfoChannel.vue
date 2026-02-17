<script setup lang="ts">
import { GetChannelByID } from '@/api/channel';
import { getOneUserByName } from '@/api/user';
import { useStore } from '@/store';
import { ref, type Ref } from 'vue';

const store = useStore();

const channelUsers : Ref<Array<string>, Array<string>> = ref([]);

const loadChannelUsers = async () =>{
    if (store.jwtToken != "")
    {
        channelUsers.value = (await GetChannelByID(store.currentChannel!.id)).users;
        for (let idx = 0; idx < channelUsers.value.length; idx++){
            const displayedName = await getOneUserByName(channelUsers.value[idx]!)
            channelUsers.value[idx] = displayedName?.display_name ?? channelUsers.value[idx];
        }

    }
}
loadChannelUsers();

</script>
<template>
    <h1>Channels users</h1>
    <li>
        <div v-for="user of channelUsers">{{ user }}</div>
    </li>
</template>
<style scoped>
</style>

<script setup lang="ts">
import { GetChannelByID } from '@/ts/channel';
import { getOneUserByName } from '@/ts/users';
import { ref, type Ref } from 'vue';

const props = defineProps({
    tokenJwt : String,
    channelId : Number
});

const channelUsers : Ref<Array<string>, Array<string>> = ref([]);
const currentChannel = props.channelId!;

const loadChannelUsers = async () =>{
    if (props.tokenJwt != "")
    {
        channelUsers.value = (await GetChannelByID(props.tokenJwt!, currentChannel)).users;
        for (var idx = 0; idx < channelUsers.value.length; idx++){
            var displayedName = await getOneUserByName(props.tokenJwt!, channelUsers.value[idx]!)            
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
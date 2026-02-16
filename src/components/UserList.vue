<script setup lang="ts">
import InfoChannel from '@/components/channels/InfoChannel.vue';
import AddUser from '@/components/users/AddUser.vue';
import { connectedUser } from '@/ts/connectedUser';
import PopUpEditChannel from './channels/PopUpEditChannel.vue';
import LoginUser from './users/LoginUser.vue';

const user = connectedUser();
const channelId = 273

</script>
<template>
    <LoginUser :store="user" :token="''" />
    <AddUser 
        v-if="user.tokenJwt != ''"
        :token-jwt="user.tokenJwt"
        :channelId="channelId"
    />
    <PopUpEditChannel
        v-if="user.tokenJwt != ''"
        :token-jwt="user.tokenJwt"
        :channel-id="channelId"
    />
    <InfoChannel
        v-if="user.tokenJwt != ''"
        :token-jwt="user.tokenJwt"
        :channel-id="channelId"
    />
</template>
<style scoped>
</style>
<script setup lang="ts">
import { GetChannelByID, LeaveChannel, RemoveUserFromChannel } from "@/api/channel";
import { useStore } from "@/store";
import { type Channel } from "@/types";
const store = useStore();

defineProps<{
    channel: Channel
}>()

const changeChannel = async(id : number) => {
    store.currentChannel = await GetChannelByID(id);
}

const leaveChannel = async (id : number) => {
    await LeaveChannel(id);
}

</script>

<template>
    
    <section class="channel-item" @click="changeChannel(channel.id)">
        <img :src="channel.img" alt="channel picture" />
        <p>{{ channel.name }}</p>
        <button v-if="!store.CheckIsCreator(channel.id)" @click="leaveChannel(channel.id)">Leave Channel</button>
    </section>
</template>

<style scoped>
.channel-item {
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
}
.channel-item p {
  flex: 1;
  margin: 0;
  font-size: 15px;
  font-weight: 500;
}

.channel-item img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255,255,255,0.2);
}

.channel-item button {
    padding: 6px 12px;
    font-size: 13px;
    border: none;
    background-color: #e74c3c;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.2s;
}
*
.channel-item button:hover {
    background-color: #c0392b;
}


</style>

<script setup lang="ts">
import { GetChannelByID, LeaveChannel } from "@/api/channel";
import { useStore } from "@/store";
import { type Channel } from "@/types";

const store = useStore();

defineProps<{
    channel: Channel
}>()

// Change the current channel in the store and update the theme colors based on the channel theme
const changeChannel = async(id : number) => {
    store.currentChannel = await GetChannelByID(id);
    if (store.currentChannel && store.currentChannel.theme) {
        document.documentElement.style.setProperty('--primary-color', store.currentChannel.theme!.primary_color);
        document.documentElement.style.setProperty('--primary-color-dark', store.currentChannel.theme!.primary_color_dark);
        document.documentElement.style.setProperty('--accent-color', store.currentChannel.theme!.accent_color);
        document.documentElement.style.setProperty('--accent-text-color', store.currentChannel.theme!.accent_text_color);
        document.documentElement.style.setProperty('--text-color', store.currentChannel.theme!.text_color);
    }
}

// Leave the channel and if the current channel is the one left, reset the current channel in the store
const leaveChannel = async (id : number) => {
    await LeaveChannel(id);
}

// Set the position of the hover effect based on the mouse position
const setHoverPos = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  el.style.setProperty('--x', `${x}px`);
  el.style.setProperty('--y', `${y}px`);
}

</script>

<template>
    <section class="channel-item" :class="{ active: store.currentChannel?.id === channel.id }" @mousemove="e => setHoverPos(e)" @click="changeChannel(channel.id)">
        <img :src="channel.img || './discardlogo.png'" alt="profile picture" class="PPchannel"/>
        <p>{{ channel.name }}</p>
        <button v-if="!store.CheckIsCreator(channel.id)" @click="leaveChannel(channel.id)" class="leave-btn-style"><img class="sortie" src="https://img.icons8.com/fluency-systems-regular/48/exit--v1.png" alt="x"/></button>
    </section>
</template>

<style scoped>
.channel-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 5px;
  padding: 2px 14px;
  margin: 0 15% 0 5%;
  border-radius: 8px;
  cursor: pointer;
  border: var(--border-color);
  background-color: var(--primary-color);
  box-shadow: var(--box-shadow-intern);
}
.channel-item p {
  flex: 1;
  margin: 0;
  font-size: medium;
  font-family: var(--text-font-family);
  font-weight: 500;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.channel-item.active {
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--accent-color)
  );
  color: var(--text-color);
  box-shadow:0 0 0 0 transparent;
}
.channel-item .PPchannel {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: var(--border-color);
}

.channel-item .sortie {
  width: 15px;
  height: 15px;
}

.channel-item:hover {
  background: radial-gradient(
    circle at var(--x) var(--y),
    var(--accent-color),
    var(--primary-color)
  );
  color: var(--text-color);
}

.leave-btn-style {
    background-color: transparent;
    border: none;
    cursor: pointer;
    margin-left: auto;
}
</style>

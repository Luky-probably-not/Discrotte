<script setup lang="ts">
import { GetChannelByID } from "@/api/channel";
import { useStore } from "@/store";
import { type Channel } from "@/types";
const store = useStore();

defineProps<{
    channel: Channel
}>()

const changeChannel = async(id : number) => {
    store.currentChannel = await GetChannelByID(id);
}

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
        <img :src="channel.img" alt="channel picture" />
        <p>{{ channel.name }}</p>
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
.channel-item img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: var(--border-color);
}

.channel-item:hover {
  background: radial-gradient(
    circle at var(--x) var(--y),
    var(--accent-color),
    var(--primary-color)
  );
  color: var(--text-color);
}
</style>

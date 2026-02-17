<script setup lang="ts">
import ChannelInfoLayout from '@/components/ChannelInfoLayout.vue';
import ChatLayout from '@/components/ChatLayout.vue';
import UserChannelsLayout from '@/components/UserChannelsLayout.vue';
import { useStore } from '@/store';

const store = useStore();
</script>

<template>
  <div class="app-layout">
    <UserChannelsLayout />

    <!-- Center: Chat area -->
    <div v-if="store.currentChannel" class="layout-panel">
      <ChatLayout />
    </div>
    <div v-else class="layout-panel chat-placeholder"></div>

    <!-- Right: Channel info -->
    <div v-if="store.currentChannel" class="layout-panel">
      <ChannelInfoLayout />
    </div>
    <div v-else class="layout-panel info-placeholder"></div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  max-height: 98dvh;
  gap: 1rem;
  padding: 1rem;
  box-sizing: border-box;
}

.app-layout > *:nth-child(1) { /* Left: UserChannelsLayout */
  flex: 0 0 25%;
  max-width: 25%;
}

.app-layout > *:nth-child(2) { /* Center: ChatLayout */
  flex: 0 0 50%;
  max-width: 50%;
}

.app-layout > *:nth-child(3) { /* Right: ChannelInfoLayout */
  flex: 0 0 25%;
  max-width: 25%;
}

.layout-panel {
  display: flex;
  flex-direction: column;
}

.chat-placeholder,
.info-placeholder {
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
}

/* Tablet: 2-column (channels+chat together, info below) */
@media (max-width: 1024px) {
  .app-layout > *:nth-child(2) { flex: 0 0 50%; }
  .app-layout > *:nth-child(3) { flex: 0 0 50%; }
}

/* Mobile: Stack vertically */
@media (max-width: 768px) {
  .app-layout {
    flex-direction: column;
  }
  .app-layout > * {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>


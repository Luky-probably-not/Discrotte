<script setup lang="ts">
import MessageList from '@/components/messages/MessageList.vue';
import MessageInput from '@/components/messages/MessageInput.vue';
</script>
<template class="middle-panel">
        <MessageList class="top"/>
        <MessageInput class="bottom"/>
</template>
<style scoped>
.middle-panel {
  display: flex;
  flex-direction: column;
  flex: 1;  
}

.top {
  flex: 1;
  overflow-y: auto;
}

.bottom {
  flex-shrink: 0;
}
.top::-webkit-scrollbar {
  width: 6px;
}

.top::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.2);
  border-radius: 4px;
}
</style>

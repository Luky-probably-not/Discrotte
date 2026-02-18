<script setup lang="ts">
import MessageList from '@/components/messages/MessageList.vue';
import MessageInput from '@/components/messages/MessageInput.vue';
</script>
<template >
    <section class="middle-panel">
        <MessageList class="top window shadow" />
        <MessageInput class="bottom window shadow"/>
    </section>
</template>
<style scoped>
.middle-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100vh;
}

.top {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.bottom {
  flex-shrink: 0;
}

</style>

<script setup lang="ts">
    import AddChannel from '@/components/channels/AddChannel.vue';
    import ChannelList from '@/components/channels/ChannelList.vue';
    import UserProfile from '@/components/users/UserProfile.vue';

</script>

<template class="right-panel">
    <section class="right-panel">
        <AddChannel class="top"/>
        <ChannelList class="middle"/>
        <UserProfile class="bottom"/>
    </section>
</template>

<style scoped>
.right-panel {
  display: flex;
  flex-direction: column;
  flex :1; 
}

.top {
  flex-shrink: 0;
}

.middle {
  flex: 1;
  overflow-y: auto;
}

.bottom {
  flex-shrink: 0;
}
.middle::-webkit-scrollbar {
  width: 6px;
}

.middle::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.2);
  border-radius: 4px;
}
</style>

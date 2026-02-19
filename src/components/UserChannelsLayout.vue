<script setup lang="ts">
    import AddChannel from '@/components/channels/AddChannel.vue';
    import ChannelList from '@/components/channels/ChannelList.vue';
    import UserProfile from '@/components/users/UserProfile.vue';

</script>

<template>
    <section class="left-panel">
        <section class="channels window shadow">
          <AddChannel class="top"/>
          <ChannelList class="middle"/>
        </section>
        <section class="window shadow">
          <UserProfile class="bottom"/>
        </section>
    </section>
</template>

<style scoped>
.left-panel {
  display: flex;
  flex-direction: column;
  flex:1;
  gap: 15px;
}

.channels {
  display: flex;
  flex-direction: column;
  flex: 0 0 85%;
  min-height: 80vh;
  max-height: 80vh;
  overflow: hidden;
  padding-bottom: 15px;
}

.top {
  flex-shrink: 0;
}

.middle {
  flex: 0 0 90%;
}

.bottom {
  flex-shrink: 0;
}

</style>

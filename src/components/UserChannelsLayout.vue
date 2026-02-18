<script setup lang="ts">
    import AddChannel from '@/components/channels/AddChannel.vue';
    import ChannelList from '@/components/channels/ChannelList.vue';
    import UserProfile from '@/components/users/UserProfile.vue';

</script>

<template>
    <section class="left-panel">
        <section class="channels shadow">
          <AddChannel class="top"/>
          <ChannelList class="middle"/>
        </section>
        <section class="user-profile shadow">
          <UserProfile class="bottom"/>
        </section>
    </section>
</template>

<style scoped>
.left-panel {
  display: flex;
  flex-direction: column;
  flex :1; 
  gap: 15px;
}

.channels {
  display: flex;
  flex-direction: column;
  height: 85%;
  border: var(--border-color);
  background-color: var(--primary-color);
  border-radius: 5px;
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

.user-profile {
  border: var(--border-color);
  border-radius: 5px;
}

.shadow {
  box-shadow: var(--box-shadow-intern);
  }
</style>

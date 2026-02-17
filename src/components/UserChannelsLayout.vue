<script setup lang="ts">
    import AddChannel from '@/components/channels/AddChannel.vue';
    import ChannelList from '@/components/channels/ChannelList.vue';
    import UserProfile from '@/components/users/UserProfile.vue';

</script>

<template>
    <section class="right-panel">
        <AddChannel />
        <ChannelList />
        <UserProfile />
    </section>
</template>

<style scoped>
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 12px; 
}
</style>

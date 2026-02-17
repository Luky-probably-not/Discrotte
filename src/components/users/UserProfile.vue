<script setup lang="ts">
    import PopUpUserProfile from '@/components/users/PopUpUserProfile.vue';
    import { ref } from 'vue';

    const showProfile = ref(false);
</script>
<template>
    <button @click="showProfile = !showProfile">Edit Profile</button>
    <div v-if="showProfile" class="overlay">
        <PopUpUserProfile
            @closeProfile="showProfile = false"
        />
    </div>
</template>
<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 1000;
}
</style>

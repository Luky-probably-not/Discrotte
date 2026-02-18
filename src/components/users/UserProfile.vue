<script setup lang="ts">
    import PopUpUserProfile from '@/components/users/PopUpUserProfile.vue';
    import { ref } from 'vue';

    const showProfile = ref(false);
</script>
<template>
        <span class="headbar"></span>
        <article class="btn-bar">
            <button @click="showProfile = !showProfile" class="btn-style btn-popup">Edit Profile</button>
        </article>
        <section v-if="showProfile" class="overlay">
            <PopUpUserProfile
                @closeProfile="showProfile = false"
            />
        </section>
        <section v-else>
        </section>
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
.panel-profile {
  position: relative;
}

button {
  height: auto;
}

.headbar {
  height: 20px;
}


</style>

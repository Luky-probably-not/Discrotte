<script setup lang="ts">
    import PopUpUserProfile from '@/components/users/PopUpUserProfile.vue';
    import { ref } from 'vue';

    const showProfile = ref(false);
</script>
<template>
    <button @click="showProfile = !showProfile">+</button>
    <PopUpUserProfile
        v-if="showProfile"
        @close="showProfile = false"
    />
</template>
<style scoped>
</style>

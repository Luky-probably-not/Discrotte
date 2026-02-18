<script setup lang="ts">
import LoginUser from '@/components/users/LoginUser.vue';

</script>
<template>
    <section class="popup shadow">
        <LoginUser />
    </section>
</template>
<style scoped>
.popup {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.2);

    display: flex;
    align-items: center;
    justify-content: center;

}
</style>

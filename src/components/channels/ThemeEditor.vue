<script setup lang="ts">
import { Theme } from '@/ts/domain/theme';

defineProps({
    theme : Theme
})

</script>
<template>
    <p>Themes</p>
    <li>
        <label>Primary color</label>
        <div v-if="theme != undefined">
            <input v-model="theme.primary_color"/>
        </div>
        <div v-else>
            <input/>
        </div>
        <label>Primary color dark</label>
        <div v-if="theme != undefined">
            <input v-model="theme.primary_color_dark"/>
        </div>
        <div v-else>
            <input/>
        </div>
        <label>Accent color</label>
        <div v-if="theme != undefined">
            <input v-model="theme.accent_color"/>
        </div>
        <div v-else>
            <input/>
        </div>
        <label>Text color</label>
        <div v-if="theme != undefined">
            <input v-model="theme.text_color"/>
        </div>
        <div v-else>
            <input/>
        </div>
        <label>Accent text_color</label>
        <div v-if="theme != undefined">
            <input v-model="theme.accent_text_color"/>
        </div>
        <div v-else>
            <input/>
        </div>
        
    </li>
</template>
<style scoped>
</style>
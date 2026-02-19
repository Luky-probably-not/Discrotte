<script setup lang="ts">
import { RemoveUserFromChannel } from '@/api/channel';
import { getOneUserByName } from '@/api/user';
import { useStore } from '@/store';
import type { User } from '@/types';
import { computed, ref, watch } from 'vue';

const store = useStore();

const props = defineProps<{
    isCreator : boolean
    userName : String
}>();

const UserInfo = ref<User>();
UserInfo.value = store.nullUser(props.userName.toString())

// Watcher pour la liste des utilisateurs du channel
const channelUsersWatcher = computed(() => store.currentChannel!.users);

watch(
    channelUsersWatcher,
    () => loadUser()
);

const loadUser = async () => {
    await store.getUserData();
    UserInfo.value = store.UsersData.find(
        u => u.username == props.userName
    )
}

const removeUserFromChannel = async (userName : string) => {
    await RemoveUserFromChannel(userName);
    loadUser()
}

loadUser();

</script>
<template>
    <section class="user-item">
        <img v-bind:src="UserInfo?.img || './BasePP.png'">
            <div class="userText">
                <div class="nameWrapper">
                    <h4 class="displayName">
                        {{ UserInfo?.display_name || userName }}
                    </h4>
                    <span class="usernameTooltip">
                        {{ UserInfo?.username || userName }}
                    </span>
                </div>
                <p class="status">{{ UserInfo?.status }}</p>
            </div>
            <div v-if="isCreator && UserInfo!.username != store.currentChannel?.creator">
                <button class="btn-style btn-submit" @click="removeUserFromChannel(UserInfo!.username)">Remove</button>
            </div>
    </section>
</template>
<style scoped>

.user-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 2px 14px;
    margin: 0 15% 0 5%;
    border-radius: 8px;
    border: var(--border-color);
    background-color: var(--primary-color);
    box-shadow: var(--box-shadow-intern);
    width: 80%;
}

.user-item img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: var(--border-color)
}

.user-item h4 {
    margin: 0;
    font-size: 16px;
}

.user-item p {
    margin: 3px 0 0 0;
    font-size: 13px;
}

.user-item > div:first-of-type,
.user-item .userText {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.user-item button {
    padding: 6px 12px;
    font-size: 13px;
    border: none;
    background-color: #e74c3c;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.2s;
}

.user-item button:hover {
    background-color: #c0392b;
}

.nameWrapper {
    position: relative;
    display: inline-block;
}

.displayName {
    margin: 0;
    cursor: pointer;
    color: var(--text-color);
}

.status {
    color: color-mix(in srgb, var(--text-color) 80%, white);
}

.usernameTooltip {
    position: absolute;
    bottom: 120%;
    left: 0;
    background-color: #222;
    color: white;
    padding: 4px 8px;
    font-size: 11px;
    border-radius: 4px;
    white-space: nowrap;
    opacity: 0;
    transform: translateY(5px);
    transition: 0.2s ease;
    pointer-events: none;
}

/* Petite flèche */
.usernameTooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 10px;
    border-width: 5px;
    border-style: solid;
    border-color: #222 transparent transparent transparent;
}

/* Hover effect */
.nameWrapper:hover .usernameTooltip {
    opacity: 1;
    transform: translateY(0);
}

</style>

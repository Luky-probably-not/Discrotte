<script setup lang="ts">
import { RemoveUserFromChannel } from '@/api/channel';
import { getMultipleUserByName } from '@/api/user';
import { useStore } from '@/store';
import type { User } from '@/types';
import { computed, ref, watch } from 'vue';

const store = useStore();

const props = defineProps<{
    isCreator : boolean
}>();

const infoUsers = ref<User[]>([]);

const channelUsersWatcher = computed(() => store.currentChannel!.users);

const loadUser = async () => {
    console.log(props.isCreator)
    infoUsers.value = await getMultipleUserByName(store.currentChannel!.users);
    compareUsers();
}

const compareUsers = () => {
    const newUsers : User[] = []
    console.log("ref")
    console.log(infoUsers.value)
    for (let i = 0; i < store.currentChannel!.users.length; i++) {
        let tempUser : User;
        const currentUser = store.currentChannel!.users[i]
        console.log(i, currentUser)
        const u = infoUsers.value.find(u => u.username == currentUser)
        console.log(currentUser, u)
        tempUser = u ??  {
                username : currentUser!,
                display_name : currentUser!,
                img : "./basePP.png",
                status : ""
            }
        newUsers.push(tempUser);
    }
    infoUsers.value = newUsers;
}

const removeUserFromChannel = async (userName : string) => {
    await RemoveUserFromChannel(userName);
    await loadUser()
}

watch(
    channelUsersWatcher,
    () => loadUser()
);

loadUser();

</script>
<template>
        <div v-for="user in infoUsers" :key="user.username" class="infoUser">
            <img v-bind:src="user.img">
            <div class="userText">
                <div class="nameWrapper">
                    <h4 class="displayName">
                        {{ user.display_name }}
                    </h4>
                    <span class="usernameTooltip">
                        {{ user.username }}
                    </span>
                </div>
                <p>{{ user.status }}</p>
            </div>
            <div v-if="isCreator && user.username != store.currentChannel?.creator">
                <button @click="removeUserFromChannel(user.username)">Remove</button>
            </div>
        </div>
</template>
<style scoped>
.infoUser {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
    border-bottom: 1px solid #e5e5e5;
}

.infoUser img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255,255,255,0.2);
}

.infoUser h4 {
    margin: 0;
    font-size: 16px;
}

.infoUser p {
    margin: 3px 0 0 0;
    font-size: 13px;
    color: #777;
}

/* Container texte (displayName + status) */
.infoUser > div:first-of-type,
.infoUser .userText {
    flex: 1;
    display: flex;
    flex-direction: column;
}

/* Bouton */
.infoUser button {
    padding: 6px 12px;
    font-size: 13px;
    border: none;
    background-color: #e74c3c;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.2s;
}

.infoUser button:hover {
    background-color: #c0392b;
}

.nameWrapper {
    position: relative;
    display: inline-block;
}

.displayName {
    margin: 0;
    cursor: pointer;
}

/* Tooltip */
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

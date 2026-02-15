import { defineStore } from "pinia";
import { ref } from "vue";

export const connectedUser = defineStore("ConnectedUser", () => {
    const userName = ref("")
    const tokenJwt = ref("")
    const addUser = (token : string, username : string) => {
        if (token == "" || username == ""){
            return;
        }
        userName.value = username;
        tokenJwt.value = token;
    }

    return {userName, tokenJwt, addUser}
});


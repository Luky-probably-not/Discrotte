import type { User } from "@/types";
import { getApiUrl, getAuthHeaders } from "@/api/apiHandler";
import { useStore } from "@/store";
import { GetChannelByID } from "./channel";

// Ajoute un utilisateur au channel
const addUserToChannel = async (username : string, idChannel : number ) => {
    const store = useStore();
    const response = await fetch(getApiUrl(`/protected/channel/${idChannel}/user/${username}`), {
        method: "PUT",
        headers : getAuthHeaders(),
    })
    if (!response.ok) {
        console.error("Error creating message:", response.status);
    }
    store.currentChannel = await GetChannelByID(idChannel);
    return;
}

// Recupere un utilisateur
const getOneUserByName = async (user : string) : Promise<User> => {
    const response = await fetch(getApiUrl(`/protected/user/meta?users=${user}`), {
        method: "GET",
        headers : getAuthHeaders(),
    });
    if (!response.ok) {
        console.error("Error creating message:", response.status);
    }
    const userData : User[] = await response.json();
    return userData[0]!;
}

// Recupere plusieurs utilisateurs
const getMultipleUserByName = async (users : string[]) : Promise<User[]> => {
    const params = users.join(",");
    console.log(params)
    const response = await fetch(getApiUrl(`/protected/user/meta?users=${params}`), {
        method: "GET",
        headers : getAuthHeaders(),
    });
    if (!response.ok) {
        console.error("Error creating message:", response.status);
    }
    const userData : User[] = await response.json();
    return userData;
}

// Met à jour les données d'un utilisateur
const UpdateUser = async (user : User) => {
    const response = await fetch(getApiUrl(`/protected/user/meta`), {
        method: "POST",
        headers : getAuthHeaders(),
        body: JSON.stringify(user),
    })
    if (!response.ok) {
        console.error("Error creating message:", response.status);
    }
    return;
}


export {
    addUserToChannel,
    getMultipleUserByName,
    getOneUserByName,
    UpdateUser
};


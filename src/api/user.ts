import type { User } from "@/types";
import { getApiUrl, getAuthHeaders } from "@/api/apiHandler";
import { useStore } from "@/store";
import { GetChannelByID } from "./channel";

const login = async (username : string, password : string) : Promise<string> => {
    const response = await fetch(getApiUrl(`/login`), {
        method: "POST",
        headers : {
            "Content-type" : "application/json"
        },
        body: JSON.stringify({
            "username" : username,
            "password" : password
        }),
    })
    if (!response.ok) {
        console.error("Error creating message:", response.status);
    }
    const data = await response.json()
    return data.token
}

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
    login,
    UpdateUser
};


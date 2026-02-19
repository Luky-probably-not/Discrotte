import { getApiUrl, getAuthHeaders } from "@/api/apiHandler";
import { useStore } from "@/store";
import type { Channel } from "@/types";

// Route pour récupérer les channels de l'utilisateur connecté
const GetChannelByUser = async () : Promise<Channel[]> => {
    const response = await fetch(getApiUrl(`/protected/user/channels`),{
        method : "GET",
        headers : getAuthHeaders(),
    })
    if (!response.ok) {
        console.error("Error creating message:", response.status);
    }
    return await response.json();
}

// Route pour récupérer un channel en fonction de son Id
const GetChannelByID = async (id: number) : Promise<Channel>=> {
    const channels = await GetChannelByUser()
    const channel = channels.find(c => c.id === id);
    if (!channel) {
        throw new Error(`Channel ${id} not found`);
    }
    return channel;
}

// Route pour mettre un jour un channel
const UpdateChannel = async (channelId : number, newChannel : Channel) => {
    const response = await fetch(getApiUrl(`/protected/channel/${channelId}/update_metadata`),{
        method: "PUT",
        body: JSON.stringify(newChannel),
        headers : getAuthHeaders(),
    })
    if (!response.ok) {
        console.error("Error creating message:", response.status);
    }
    return;
}

// Route pour créer un channel et l'instantie en tant que channel actuel
const PostChannel = async (name: string, img: string) => {
    const store = useStore()
    const request = await fetch(getApiUrl(`/protected/channel`),{
        method : "POST",
        headers : getAuthHeaders(),
        body:JSON.stringify({
            "name" : name,
            "img" : img
        }),
    })
    const response = await request.json()
    const newChannel: Channel = {
        id: response,
        name: name,
        img: img,
        creator: store.username,
        theme: {
            primary_color: "",
            primary_color_dark: "",
            accent_color: "",
            text_color: "",
            accent_text_color: ""
        },
        users: []
    }
    store.userChannels.push(newChannel)
    store.currentChannel = response
    return
}

// Route pour retirer un utilisateur du channel en cours
const RemoveUserFromChannel = async (username : string) => {
    const store = useStore();
    const channelId = store.currentChannel!.id;
    await fetch(getApiUrl(`/protected/channel/${channelId}/user/${username}`), {
        method: "DELETE",
        headers : getAuthHeaders()
    });
    store.currentChannel = await GetChannelByID(channelId);
}

// Route pour quitter un channel
const LeaveChannel = async (channelId : number) => {
    const store = useStore();
    const userName = store.username
    const request = await fetch(getApiUrl(`/protected/channel/${channelId}/user/${userName}`), {
        method: "DELETE",
        headers : getAuthHeaders()
    });
    console.log(request.status)
    store.userChannels = await GetChannelByUser()
}

// Route pour supprimer un channel
const DeleteChannel = async (channelId : number) => {
    const store = useStore();

    await fetch(getApiUrl(`/protected/channel/${channelId}`),{
        method: "DELETE",
        headers : getAuthHeaders()
    });
    store.userChannels = await GetChannelByUser();
}
export {
    DeleteChannel,
    GetChannelByID,
    GetChannelByUser,
    LeaveChannel,
    PostChannel,
    RemoveUserFromChannel,
    UpdateChannel
};


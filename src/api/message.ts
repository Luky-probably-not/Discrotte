import { getApiUrl, getAuthHeaders } from "@/api/apiHandler";
import type { Message } from "@/types";

// Route pour récuperer les messages d'un channel
const getChannelMessages = async (channelId: number, offset: number): Promise<Message[]> => {
    const response = await fetch(getApiUrl(`/protected/channel/${channelId}/messages/${offset}`), {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        console.error("Error getting messages:", response.status);
    }
    return await response.json();
};

// Route pour créer un message dans le channel
const createMessage = async (channelId: number, type: string, message: string) => {
    const response = await fetch(getApiUrl(`/protected/channel/${channelId}/message`), {
        method : "POST",
        headers : getAuthHeaders(),
        body: JSON.stringify({
            "type" : type,
            "value" : message
        }),

    });
    if (!response.ok) {
        console.error("Error creating message:", response.status);
    }
    return;
}

// Route pour modifier un message
const updateMessage = async (message: Message) => {
    const response = await fetch(getApiUrl(`/protected/channel/${message.channel_id}/message/moderate`), {
        method : "POST",
        headers : getAuthHeaders(),
        body: JSON.stringify(message),
    });
    if (!response.ok) {
        console.error("Error updating message:", response.status);
    }
    return;
}

export {
    createMessage,
    getChannelMessages,
    updateMessage
};


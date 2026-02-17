import type { Message } from "@/types";
import { getApiUrl, getAuthHeaders } from "@/api/apiHandler";

const getChannelMessages = async (channelId: number): Promise<Message[]> => {
    const response = await fetch(getApiUrl(`/protected/channel/${channelId}/messages/0`), {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        console.error("Error getting messages:", response.status);
    }
    return await response.json();
};

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
    getChannelMessages,
    createMessage,
    updateMessage
}

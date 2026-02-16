import { Message } from "./domain/message.ts";
const apiUrl = import.meta.env.VITE_API_URL as string;

const getChannelMessages = async (token: string, channelId: number) => {
    const request = await fetch(apiUrl + `/protected/channel/${channelId}/messages/0`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });
    const response: Message[] = await request.json();

    return response;
};

const createMessage = async (token: string, channelId: number, type: string, message: string) => {
    const request = await fetch(apiUrl + `/protected/channel/${channelId}/message`, {
        method : "POST",
        body: JSON.stringify({
            "type" : type,
            "value" : message
        }),
        headers : {
            "Authorization" : "Bearer " + token,
            "Content-Type": "application/json"
        },
    });
    if(request.status != 200){
        console.log("Error updating message")
    }
    return;
}

const updateMessage = async (token: string, message: Message) => {
    const request = await fetch(apiUrl + `/protected/channel/${message.channel_id}/message/moderate`, {
        method : "POST",
        body: JSON.stringify(message),
        headers : {
            "Authorization" : "Bearer " + token,
            "Content-Type": "application/json"
        },
    });
    
    if(request.status != 200){
        console.log("Error updating message")
    }
    return;
}

export {
    getChannelMessages,
    createMessage,
    updateMessage
}

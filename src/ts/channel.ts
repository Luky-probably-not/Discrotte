import type { Chanel } from "./domain/channel";
import { updateDataChannelUrl } from "./urls/channels";
const api_url = import.meta.env.VITE_API_URL as string

const GetChannelByUser = async (token : string) : Promise<Array<Chanel>> => {
    const request = await fetch(api_url+"/protected/user/channels",{
        method : "GET",
        headers : {
            "Authorization" : "Bearer " + token
        }
    })
    if (request.status != 200)
        return [];
    const response = await request.json()
    return response
}

const GetChannelByID = async (token : string, id: number) : Promise<Chanel>=> {
    const channels = await GetChannelByUser(token)
    return channels.find((c: any) => c.id === id)!
}

const UpdateChannel = async (token : string, channelId : number, newChannel : Chanel) => {
    const url = updateDataChannelUrl(channelId)
    console.log(url);
    const request = await fetch(url,{
        method: "PUT",
        body: JSON.stringify(newChannel),
        headers : {
            "Authorization" : "Bearer " + token,
            "Content-type" : "application/json"
        }
    })
    return;
}


export {
    GetChannelByID, GetChannelByUser, UpdateChannel
};


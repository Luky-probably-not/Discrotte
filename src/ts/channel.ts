import { updateDataChannelUrl } from "./urls/channels";
import { type ChannelInfo} from "@/ts/domain/channel"
import { ref, type Ref } from "vue"
import { Theme } from "./domain/theme";
const api_url = import.meta.env.VITE_API_URL as string

const GetChannelByUser = async (token : string) : Promise<Array<ChannelInfo>> => {
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

const GetChannelByID = async (token : string, id: number) : Promise<ChannelInfo>=> {
    const channels = await GetChannelByUser(token)
    return channels.find((c: any) => c.id === id)!
}

const UpdateChannel = async (token : string, channelId : number, newChannel : ChannelInfo) => {
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


const AddChannel = async (token : string, name: string, img: string) => {
    const request = await fetch(api_url+"/protected/channel",{
        method : "POST",
        body:JSON.stringify({
            "name" : name,
            "img" : img
        }),
        headers : {
            "Authorization" : "Bearer " + token,
            "Content-Type": "application/json"
        },
    })
    const response = await request.json()
    const newChannel: ChannelInfo = {
        id: response,
        name: name,
        img: img,
        creator: "",
        theme: new Theme,
        users: new Array()    
    }
    channels.value.push(newChannel)
    selectedChannelID.value = response
    return response
}

const selectedChannelID = ref<number | null>(null)
const PrintPopUpChannel = ref(false)
const channels: Ref<ChannelInfo[]> = ref([])

export {
    GetChannelByID, 
    GetChannelByUser, 
    UpdateChannel,
    channels,
    selectedChannelID,
    PrintPopUpChannel,
    AddChannel
}

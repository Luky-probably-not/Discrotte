import { type Channel} from "@/ts/type"
import { ref } from "vue"
const api_url = import.meta.env.VITE_API_URL as string

const token = "eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbiI6ImZhbHNlIiwiaWF0IjoiMTc3MTIyNzg3NyIsInN1YiI6ImMuam9seSJ9.2ZfMduv_DaWCely2d1B9LwjvwIf8Cq3wuXDxKwyLND0"

const GetChannelByUser = async () => {
    const request = await fetch(api_url+"/protected/user/channels",{
        method : "GET",
        headers : {
            "Authorization" : "Bearer " + token
        }
    })
    const response = await request.json()
    return response
}

const GetChannelByID = async (id: number) => {
  const channels = await GetChannelByUser()
  return channels.find((c: any) => c.id === id)
}

const selectedChannelID = ref<number | null>(null)
export {
    selectedChannelID,
    GetChannelByUser,
    GetChannelByID,
    type Channel
}


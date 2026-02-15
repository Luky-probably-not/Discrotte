const api_url = import.meta.env.VITE_API_URL as string


const GetChannelByUser = async (token : string) => {
    const request = await fetch(api_url+"/protected/user/channels",{
        method : "GET",
        headers : {
            "Authorization" : "Bearer " + token
        }
    })
    const response = await request.json()
    return response
}

const GetChannelByID = async (token : string, id: number) => {
  const channels = await GetChannelByUser(token)
  return channels.find((c: any) => c.id === id)
}

export {
    GetChannelByID, GetChannelByUser
}

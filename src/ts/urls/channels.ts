const api_url = import.meta.env.VITE_API_URL as string;

const updateChannelUrl = api_url + "/protected/channel/{channel_id}/update_metadata"

const updateDataChannelUrl = (idChannel : number) => {
    return updateChannelUrl.replace("{channel_id}",idChannel.toString())
}

export { updateDataChannelUrl };

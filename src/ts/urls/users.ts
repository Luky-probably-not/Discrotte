const apiUrl = import.meta.env.VITE_API_URL as string

const loginUrl = apiUrl + "/login";

const getUserByNameUrl = apiUrl + "/protected/user/meta";

const addUserToChannelUrl = (channel_id : number, username : string) : string =>
    apiUrl + `/protected/channel/${channel_id}/user/${username}`


const getMultipleUserByNameUrl = (users : string[]) : string => {
    const params = users.join(",");
    return `${getUserByNameUrl}?users=${params}`
}

const getOneUserByNameUrl = (user : string) : string => {
    return `${getUserByNameUrl}?users=${user}`
};

export { addUserToChannelUrl, getMultipleUserByNameUrl, getOneUserByNameUrl, loginUrl}
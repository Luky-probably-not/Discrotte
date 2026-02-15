const apiUrl = import.meta.env.VITE_API_URL as string

const loginUrl = apiUrl + "/login";
const addUserToChannelUrl = (channel_id : number, username : string) : string =>
    apiUrl + `/protected/channel/${channel_id}/user/${username}`

const login = async (username : string, password : string) : Promise<string> => {
    var request = await fetch(loginUrl, {
        method: "POST",
        body: JSON.stringify({
            "username" : username,
            "password" : password
        }),
        headers : { 
            "Content-type" : "application/json"
        }
    })
    var response = await request.json()
    return response.token
}

const addUserToChannel = async (token : string, username : string, idChannel : number ) => {
    var request = await fetch(addUserToChannelUrl(idChannel, username), {
        method: "PUT",
        headers : {
            "Authorization" : "Bearer " + token
        }
    })
    var response = await request.status
    console.log(response)
    return;
}

export { addUserToChannel, login };


import type { User } from "./domain/user";
import { addUserToChannelUrl, getMultipleUserByNameUrl, getOneUserByNameUrl, loginUrl } from "./urls/users";


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
    return;
}

const getOneUserByName = async (token : string, user : string) : Promise<User> => {
    var request = await fetch(getOneUserByNameUrl(user), {
        method: "GET",
        headers :{
            "Authorization" : "Bearer " + token
        }
    });
    var response : User[] = await request.json();
    return response[0]!;
}

const getMultipleUserByName = async (token : string, users : string[]) : Promise<User[]> => {
    var request = await fetch(getMultipleUserByNameUrl(users), {
        method: "GET",
        headers :{
            "Authorization" : "Bearer " + token
        }
    });
    var response : User[] = await request.json();
    return response;
}

export { addUserToChannel, getMultipleUserByName, getOneUserByName, login };


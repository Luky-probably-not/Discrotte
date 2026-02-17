import { getApiUrl, getAuthHeaders  } from "@/api/apiHandler";


const login = async (username : string, password : string) : Promise<string> => {
    const response = await fetch(getApiUrl(`/login`), {
        method: "POST",
        headers : {
            "Content-type" : "application/json"
        },
        body: JSON.stringify({
            "username" : username,
            "password" : password
        }),
    })
    if (!response.ok) {
        console.error("Error creating message:", response.status);
    }
    const data = await response.json()
    return data.token
}
const extendSession = async (): Promise<string> => {
    const response = await fetch(getApiUrl(`/protected/extend_session`), {
        method: "POST",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        console.error("Session extend failed:", response.status);
    }

    const data = await response.json();
    return data.token;
};

export {
    login,
    extendSession,
};

import { useStore } from "@/store";

const apiBaseUrl = import.meta.env.VITE_API_URL

export const getAuthHeaders = () => {
    const store = useStore();
    const token = store.jwtToken

    return {
        'Content-Type' : 'application/json',
        ...(token && {Authorization: `Bearer ${token}`}),
    }
}

export const getApiUrl= (endpoint: string): string => {
    return `${apiBaseUrl}${endpoint}`
}

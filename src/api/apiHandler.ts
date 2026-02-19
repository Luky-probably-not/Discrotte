import { useStore } from "@/store";

const apiBaseUrl = import.meta.env.VITE_API_URL

// Headers pour chaque requête
export const getAuthHeaders = () => {
    const store = useStore();
    const token = store.jwtToken

    return {
        'Content-Type' : 'application/json',
        ...(token && {Authorization: `Bearer ${token}`}),
    }
}

// Utilise l'url de .env
export const getApiUrl= (endpoint: string): string => {
    return `${apiBaseUrl}${endpoint}`
}

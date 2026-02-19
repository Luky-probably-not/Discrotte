import { type Channel } from "@/types";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { extendSession } from "@/api/auth";

export const useStore = defineStore("main", () => {
    // --- STATE DECLARATIONS ---

    const username = ref<string>("");
    const jwtToken = ref<string>("");
    const tokenExpiry = ref<number>(0);
    const refreshTimeout = ref<number | null>(null);
    const currentChannel = ref<Channel | null>(null);
    const userChannels = ref<Channel[]>([]);
    const messageDrafts = ref<Record<number, string>>({});

    // --- COMPUTED PROPERTIES ---

    // Checks if the JWT token exists and not expired
    const isTokenValid = computed(() => {
        // Token is valid if it exists AND current time is before expiry
        return jwtToken.value && Date.now() / 1000 < tokenExpiry.value;
    });

    // --- TOKEN REFRESH MANAGEMENT ---

    // Starts a timer to refresh the token 5 minutes before expiry
    const startRefreshTimer = () => {
        // Clear any existing timer to avoid duplicates
        if (refreshTimeout.value) {
            clearTimeout(refreshTimeout.value);
        }

        // Calculate when to trigger refresh: expiry time minus 5 minutes
        const timeUntilRefresh = (tokenExpiry.value * 1000) - Date.now() - (5 * 60 * 1000);

        // Only set timer if there's time remaining
        if (timeUntilRefresh > 0) {
            refreshTimeout.value = setTimeout(async () => {
                await refreshToken();
            }, timeUntilRefresh) as number;
        }
    };

    // Stops and clears any active refresh timer
    const stopRefreshTimer = () => {
        if (refreshTimeout.value) {
            clearTimeout(refreshTimeout.value);
            refreshTimeout.value = null;
        }
    };

    // --- AUTHENTICATION FLOW ---

    // Loads authentication info from localStorage on app startup
    // Validates token and sets up auto-refresh
    // Returns true if user is authenticated, false otherwise
    const loadAuthInfo = async () => {
        const storedUsername = localStorage.getItem('username') ?? '';
        const storedToken = localStorage.getItem('jwt_token') ?? '';
        const storedExpiry = localStorage.getItem('token_expiry') ?? 0;

        // Fail if username or token is missing from storage
        if (!storedToken || !storedUsername) {
            clearAuthInfo();
            return false;
        }

        // Parse stored expiry or default to 3 hours from now
        const expiry = storedExpiry ? parseInt(storedExpiry) : (Date.now() / 1000) + 3 * 60 * 60;
        tokenExpiry.value = expiry;
        username.value = storedUsername;
        jwtToken.value = storedToken;

        // If token is expired, clear everything and fail
        if (!isTokenValid.value) {
            clearAuthInfo();
            return false;
        }

        // Start auto-refresh timer for valid token
        startRefreshTimer();
        return true;
    };

    // Requests a new token from the API to extend the session
    // Called automatically by the refresh timer 5 minutes before expiry
    // Returns true on success, false on failure
    const refreshToken = async (): Promise<boolean> => {
        try {
            const newToken = await extendSession();
            jwtToken.value = newToken;
            // Set new expiry to 3 hours from now
            tokenExpiry.value = Date.now() / 1000 + 3 * 60 * 60;

            // Persist updated token and expiry to localStorage
            localStorage.setItem('jwt_token', jwtToken.value);
            localStorage.setItem('token_expiry', tokenExpiry.value.toString());

            // Restart the auto-refresh timer with new expiry time
            startRefreshTimer();
            return true;
        } catch (error) {
            // If refresh fails, clear all auth info and logout user
            console.error('Token refresh failed:', error);
            clearAuthInfo();
            return false;
        }
    };

    // Sets authentication info after successful login
    // Stores credentials in both state and localStorage
    const setAuthInfo = (connectedUsername: string, token: string) => {
        username.value = connectedUsername;
        jwtToken.value = token;
        // Set expiry to 3 hours from login
        tokenExpiry.value = Date.now() / 1000 + 3 * 60 * 60;

        // Persist auth info to localStorage for session persistence
        localStorage.setItem('username', connectedUsername);
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('token_expiry', tokenExpiry.value.toString());

        // Start timer for automatic token refresh
        startRefreshTimer();
    };

    // Completely clears all authentication data and state
    // Called on logout or when session becomes invalid
    const clearAuthInfo = () => {
        stopRefreshTimer();
        username.value = "";
        jwtToken.value = "";
        tokenExpiry.value = 0;
        currentChannel.value = null;
        userChannels.value = [];
        messageDrafts.value = {};

        // Remove all auth data from localStorage
        localStorage.removeItem('username');
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('token_expiry');
    };

    // --- MESSAGE DRAFT MANAGEMENT ---

    // Saves a message draft for a specific channel
    const setDraftForChannel = (channelId: number, text: string) => {
        messageDrafts.value[channelId] = text;
    };

    // Retrieves a saved message draft for a specific channel
    // Returns undefined if no draft exists
    const getDraftForChannel = (channelId: number): string | undefined => {
        return messageDrafts.value[channelId];
    };

    // Clears the saved draft for a specific channel
    const clearDraftForChannel = (channelId: number) => {
        delete messageDrafts.value[channelId];
    };

    // --- CHANNEL UTILITIES ---

    // Checks if the current user is the creator of a specific channel
    // Returns true if user is the creator, false otherwise
    const checkIsCreator = (channelId : number) => {
        const channel = userChannels.value.find(c => c.id == channelId);

        // Return false if channel not found
        if (channel == undefined)
            return false;

        // Compare creator to current username
        return channel.creator == username.value
    }

    // --- STORE EXPORTS ---
    return {
        username,
        jwtToken,
        tokenExpiry,
        currentChannel,
        userChannels,
        messageDrafts,
        isTokenValid,
        setAuthInfo,
        loadAuthInfo,
        clearAuthInfo,
        refreshToken,
        setDraftForChannel,
        getDraftForChannel,
        clearDraftForChannel,
        CheckIsCreator: checkIsCreator
    }
});

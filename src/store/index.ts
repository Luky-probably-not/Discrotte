import { type Channel } from "@/types";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { extendSession } from "@/api/auth";

export const useStore = defineStore("main", () => {
    // STATE
    const username = ref<string>("");
    const jwtToken = ref<string>("");
    const tokenExpiry = ref<number>(0);
    const refreshTimeout = ref<number | null>(null);
    const currentChannel = ref<Channel | null>(null);
    const userChannels = ref<Channel[]>([]);
    const messageDrafts = ref<Record<number, string>>({});


    // Token validity check
    const isTokenValid = computed(() => {
        return jwtToken.value && Date.now() / 1000 < tokenExpiry.value;
    });

    // Auto refresh 5min before expiry
    const startRefreshTimer = () => {
        if (refreshTimeout.value) {
            clearTimeout(refreshTimeout.value);
        }

        const timeUntilRefresh = (tokenExpiry.value * 1000) - Date.now() - (5 * 60 * 1000);

        if (timeUntilRefresh > 0) {
            refreshTimeout.value = setTimeout(async () => {
                await refreshToken();
            }, timeUntilRefresh) as number;
        }
    };

    const stopRefreshTimer = () => {
        if (refreshTimeout.value) {
            clearTimeout(refreshTimeout.value);
            refreshTimeout.value = null;
        }
    };

    // Load/validate localStorage on startup
    const loadAuthInfo = async () => {
        const storedUsername = localStorage.getItem('username') ?? '';
        const storedToken = localStorage.getItem('jwt_token') ?? '';
        const storedExpiry = localStorage.getItem('token_expiry') ?? 0;

        if (!storedToken || !storedUsername) {
            clearAuthInfo();
            return false;
        }

        const expiry = storedExpiry ? parseInt(storedExpiry) : (Date.now() / 1000) + 3 * 60 * 60;
        tokenExpiry.value = expiry;
        username.value = storedUsername;
        jwtToken.value = storedToken;

        if (!isTokenValid.value) {
            clearAuthInfo();
            return false;
        }

        startRefreshTimer();
        return true;
    };

    // Refresh token via API (called by timer)
    const refreshToken = async (): Promise<boolean> => {
        try {
            const newToken = await extendSession();
            jwtToken.value = newToken;
            tokenExpiry.value = Date.now() / 1000 + 3 * 60 * 60;

            localStorage.setItem('jwt_token', jwtToken.value);
            localStorage.setItem('token_expiry', tokenExpiry.value.toString());

            startRefreshTimer();
            console.log("TEST: token refresh sucessful! (check pinia to be sure)")
            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);
            clearAuthInfo();
            return false;
        }
    };

    // Set after login
    const setAuthInfo = (connectedUsername: string, token: string) => {
        username.value = connectedUsername;
        jwtToken.value = token;
        tokenExpiry.value = Date.now() / 1000 + 3 * 60 * 60;

        localStorage.setItem('username', connectedUsername);
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('token_expiry', tokenExpiry.value.toString());

        startRefreshTimer();
    };

    // Complete logout cleanup
    const clearAuthInfo = () => {
        stopRefreshTimer();
        username.value = "";
        jwtToken.value = "";
        tokenExpiry.value = 0;
        currentChannel.value = null;
        userChannels.value = [];
        messageDrafts.value = {};

        localStorage.removeItem('username');
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('token_expiry');
    };

    // Message drafts methods
    const setDraftForChannel = (channelId: number, text: string) => {
        messageDrafts.value[channelId] = text;
    };

    const getDraftForChannel = (channelId: number): string | undefined => {
        return messageDrafts.value[channelId];
    };

    const clearDraftForChannel = (channelId: number) => {
        delete messageDrafts.value[channelId];
    };

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
    };
});

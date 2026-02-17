import { defineStore } from "pinia";
import { ref } from "vue";
import { type Channel } from "@/types";

export const useStore = defineStore("Discard", () => {
    const username = ref<string>("")
    const jwtToken = ref<string>("")
    const currentChannelId = ref<number>(0)
    const userChannels = ref<Channel[]>([])
    const messageDrafts = ref<Record<string, string>>({});


    const setAuthInfo = (connectedUsername: string, token: string) => {
        username.value = connectedUsername
        jwtToken.value = token
        localStorage.setItem('username', connectedUsername)
        localStorage.setItem('jwt_token', token)
    }

    const loadAuthInfo = () => {
        username.value = localStorage.getItem('username') ?? ""
        jwtToken.value = localStorage.getItem('jwt_token') ?? ""
    }

    const clearAuthInfo = () => {
        username.value = ""
        jwtToken.value = ""
        currentChannelId.value = 0
        userChannels.value = []
        messageDrafts.value = {}
        localStorage.removeItem('username')
        localStorage.removeItem('jwt_token')
    }

        // set or update draft for one channel
    const setDraftForChannel = (channelId: string, text: string) => {
        messageDrafts.value[channelId] = text;
    };

    // get draft for one channel (undefined if none)
    const getDraftForChannel = (channelId: string): string | undefined => {
        return messageDrafts.value[channelId];
    };

    // remove draft (after sending)
    const clearDraftForChannel = (channelId: string) => {
        delete messageDrafts.value[channelId];
    };

    return {
        jwtToken,
        username,
        currentChannelId,
        userChannels,
        messageDrafts,
        setAuthInfo,
        loadAuthInfo,
        clearAuthInfo,
        setDraftForChannel,
        getDraftForChannel,
        clearDraftForChannel,
    }
});

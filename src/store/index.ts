import { GetChannelByUser } from "@/api/channel";
import { type Channel } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useStore = defineStore("Discard", () => {
    const username = ref<string>("")
    const jwtToken = ref<string>("")
    const currentChannel = ref<Channel | null>()
    const userChannels = ref<Channel[]>([])
    const messageDrafts = ref<Record<number, string>>({});

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
        currentChannel.value = null
        userChannels.value = []
        messageDrafts.value = {}
        localStorage.removeItem('username')
        localStorage.removeItem('jwt_token')
    }

        // set or update draft for one channel
    const setDraftForChannel = (channelId: number, text: string) => {
        messageDrafts.value[channelId] = text;
    };

    // get draft for one channel (undefined if none)
    const getDraftForChannel = (channelId: number): string | undefined => {
        return messageDrafts.value[channelId];
    };

    // remove draft (after sending)
    const clearDraftForChannel = (channelId: number) => {
        delete messageDrafts.value[channelId];
    };

    const checkIsCreator = (channelId : number) => {
        const channel = userChannels.value.find(c => c.id == channelId);

        if (channel == undefined)
            return false;
        return channel.creator == username.value
    }

    return {
        jwtToken,
        username,
        currentChannel,
        userChannels,
        messageDrafts,
        setAuthInfo,
        loadAuthInfo,
        clearAuthInfo,
        setDraftForChannel,
        getDraftForChannel,
        clearDraftForChannel,
        CheckIsCreator: checkIsCreator
    }
});

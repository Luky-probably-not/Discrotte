export interface Channel {
    id: number
    name: string
    img: string
    creator: string
    theme: Theme | null
    users: Array<string>
}

export interface Message {
    channel_id: number
    timestamp: number
    author: string
    content: {
        type: string;
        value: string;
    }
}

export interface Theme {
    primary_color: string
    primary_color_dark : string
    accent_color : string
    text_color : string
    accent_text_color : string
}

export interface User {
    username: string
    display_name: string
    img: string
    status: string
}

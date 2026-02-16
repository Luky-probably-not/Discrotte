export class Message {
    channel_id: number = 0;
    timestamp: number = 0;
    author: string = "";
    content: {
        type: string;
        value: string;
    } = {
        type: "",
        value: ""
    };
}
import { Theme } from "./theme";

export class ChannelInfo {
    id: number = -1;
    name: string = "";
    img: string = "";
    creator: string = "";
    theme: Theme = new Theme;
    users: Array<string> = [];
}
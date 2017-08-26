import AbstractEvent from "./AbstractEvent";
import GuildPacket from "../Packet/GuildPacket";

export default class GuildCreate extends AbstractEvent {
    protected get data(): GuildPacket {
        return super.data;
    }

    public handle(): Promise<void> {
        if (this.data.unavailable) {
            
        }

        return undefined;
    }
}

import Kernel from "../../Kernel";
import ReadyPacket from "../Packet/ReadyPacket";
import AbstractEvent from "./AbstractEvent";

/**
 * Event for READY
 *
 * @prop data {ReadyPacket}
 */
export default class ReadyEvent extends AbstractEvent {
    protected get data(): ReadyPacket {
        return super.data;
    }

    public async handle(): Promise<void> {
        this.shard.connectAttempts   = 0;
        this.shard.reconnectInterval = 1000;

        this.shard.connecting       = false;
        this.shard.status           = "connected";
        this.kernel.presence.status = "online";
        this.kernel.shardHandler.readyPacketCB();

        if (this.type === "RESUMED") {
            this.shard.preReady = true;
            this.shard.ready    = true;

            this.emit("resume");

            return;
        }

        this.kernel.user = await this.kernel.users.upsert(this.data.user);
        if (this.data._trace) {
            this.shard.discordServerTrace = this.data._trace;
        }

        this.shard.sessionID = this.data.session_id;

        Kernel.logger.silly("[READY] Looping through guilds");
        for (const guild of this.data.guilds) {
            if (guild.unavailable) {
                this.kernel.unavailableGuilds.add(guild, this.kernel, true);
            } else {
                this.kernel.unavailableGuilds.remove(this.shard.createGuild(guild));
            }
        }

        Kernel.logger.silly("[READY] Looping through private channels");
        for (const channel of this.data.private_channels) {
            if (channel.type === undefined || channel.type === 1) {
                this.kernel.privateChannelMap[channel.recipients[0].id.toString()] = channel.id;
                await this.kernel.privateChannels.upsert(channel);
            }
        }

        this.shard.preReady = true;
        this.kernel.emit("shardPreReady", this.shard.id);
        if (this.kernel.unavailableGuilds.size > 0 && this.data.guilds.length > 0) {
            this.shard.restartGuildCreateTimeout();
        } else {
            this.shard.checkReady();
        }
    }
}

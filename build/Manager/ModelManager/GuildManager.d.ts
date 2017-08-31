import GuildPacket from "../../Gateway/Packet/GuildPacket";
import Guild from "../../Model/Guild";
import ModelInterface from "../../Model/ModelInterface";
import AbstractModelManager from "./AbstractModelManager";
export default class GuildManager extends AbstractModelManager<Guild> {
    initialize(model: Guild, data: GuildPacket, parent?: ModelInterface): Promise<void>;
    update(model: Guild, data: GuildPacket): Promise<void>;
}

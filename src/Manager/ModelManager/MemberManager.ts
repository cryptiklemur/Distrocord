import MemberPacket from "../../Gateway/Packet/MemberPacket";
import Guild from "../../Model/Guild";
import Member from "../../Model/Member";
import ModelInterface from "../../Model/ModelInterface";
import AbstractModelManager from "./AbstractModelManager";

export default class MemberManager extends AbstractModelManager<Member> {
    public async initialize(model: Member, data: MemberPacket, parent: Guild | ModelInterface): Promise<void> {
        model.guild = parent as Guild;
        model.user  = data.user.id;
    }

    public async update(model: Member, data: MemberPacket): Promise<void> {
        this.updateField(model, "joinedAt", data)
            .updateField(model, "nick", data)
            .updateField(model, "status", data)
            .updateField(model, "game", data)
            .updateField(model, "username", data.user)
            .updateField(model, "avatar", data.user)
            .updateField(model, "discriminator", data.user);

        if (data.roles !== undefined) {
            model.roles = data.roles.map((x) => x.toString());
        }
    }
}

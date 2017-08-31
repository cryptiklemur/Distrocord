import MemberPacket from "../../Gateway/Packet/MemberPacket";
import Guild from "../../Model/Guild";
import Member from "../../Model/Member";
import ModelInterface from "../../Model/ModelInterface";
import AbstractModelManager from "./AbstractModelManager";
export default class MemberManager extends AbstractModelManager<Member> {
    initialize(model: Member, data: MemberPacket, parent: Guild | ModelInterface): Promise<void>;
    update(model: Member, data: MemberPacket): Promise<void>;
}

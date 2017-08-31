import ReadyPacket from "../Packet/ReadyPacket";
import AbstractEvent from "./AbstractEvent";
/**
 * Event for READY
 *
 * @prop data {ReadyPacket}
 */
export default class ReadyEvent extends AbstractEvent {
    protected readonly data: ReadyPacket;
    handle(): Promise<void>;
}

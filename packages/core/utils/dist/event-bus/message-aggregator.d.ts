import { EventBusTypes, IMessageAggregator, Message, MessageAggregatorFormat } from "@medusajs/types";
export declare class MessageAggregator implements IMessageAggregator {
    private messages;
    constructor();
    save(msg: Message | Message[]): void;
    saveRawMessageData<T>(messageData: EventBusTypes.MessageFormat<T> | EventBusTypes.MessageFormat<T>[], options?: Record<string, unknown>): void;
    getMessages(format?: MessageAggregatorFormat): {
        [group: string]: Message[];
    };
    clearMessages(): void;
    private getValueFromPath;
    private compareMessages;
}

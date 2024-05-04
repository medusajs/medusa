import { EventBusTypes } from "@medusajs/types";
export declare abstract class AbstractEventBusModuleService implements EventBusTypes.IEventBusModuleService {
    protected eventToSubscribersMap_: Map<string | symbol, EventBusTypes.SubscriberDescriptor[]>;
    get eventToSubscribersMap(): Map<string | symbol, EventBusTypes.SubscriberDescriptor[]>;
    abstract emit<T>(eventName: string, data: T, options: Record<string, unknown>): Promise<void>;
    abstract emit<T>(data: EventBusTypes.EmitData<T>[]): Promise<void>;
    abstract emit<T>(data: EventBusTypes.Message<T>[]): Promise<void>;
    protected storeSubscribers({ event, subscriberId, subscriber, }: {
        event: string | symbol;
        subscriberId: string;
        subscriber: EventBusTypes.Subscriber;
    }): void;
    subscribe(eventName: string | symbol, subscriber: EventBusTypes.Subscriber, context?: EventBusTypes.SubscriberContext): this;
    unsubscribe(eventName: string | symbol, subscriber: EventBusTypes.Subscriber, context: EventBusTypes.SubscriberContext): this;
}
export * from "./build-event-messages";
export * from "./common-events";
export * from "./message-aggregator";
export * from "./utils";

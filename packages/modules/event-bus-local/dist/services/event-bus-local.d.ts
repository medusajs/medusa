/// <reference types="node" />
import { MedusaContainer } from "@medusajs/modules-sdk";
import { EmitData, EventBusTypes, Logger, Message, Subscriber } from "@medusajs/types";
import { AbstractEventBusModuleService } from "@medusajs/utils";
import { EventEmitter } from "events";
type InjectedDependencies = {
    logger: Logger;
};
export default class LocalEventBusService extends AbstractEventBusModuleService {
    protected readonly logger_?: Logger;
    protected readonly eventEmitter_: EventEmitter;
    constructor({ logger }: MedusaContainer & InjectedDependencies);
    emit<T>(eventName: string, data: T, options: Record<string, unknown>): Promise<void>;
    /**
     * Emit a number of events
     * @param {EmitData} data - the data to send to the subscriber.
     */
    emit<T>(data: EmitData<T>[]): Promise<void>;
    emit<T>(data: Message<T>[]): Promise<void>;
    subscribe(event: string | symbol, subscriber: Subscriber): this;
    unsubscribe(event: string | symbol, subscriber: Subscriber, context?: EventBusTypes.SubscriberContext): this;
}
export {};

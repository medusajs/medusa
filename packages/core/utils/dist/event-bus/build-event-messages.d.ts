import { Context, EventBusTypes } from "@medusajs/types";
/**
 * Build messages from message data to be consumed by the event bus and emitted to the consumer
 * @param MessageFormat
 * @param options
 */
export declare function buildEventMessages<T>(messageData: EventBusTypes.MessageFormat<T> | EventBusTypes.MessageFormat<T>[], options?: Record<string, unknown>): EventBusTypes.Message<T>[];
/**
 * Helper function to compose and normalize a Message to be emitted by EventBus Module
 * @param eventName  Name of the event to be emitted
 * @param data The content of the message
 * @param metadata Metadata of the message
 * @param context Context from the caller service
 * @param options Options to be passed to the event bus
 */
export declare function composeMessage(eventName: string, { data, service, entity, action, context, options, }: {
    data: unknown;
    service: string;
    entity: string;
    action?: string;
    context?: Context;
    options?: Record<string, unknown>;
}): EventBusTypes.Message;

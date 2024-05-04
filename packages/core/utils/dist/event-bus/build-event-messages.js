"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeMessage = exports.buildEventMessages = void 0;
var common_events_1 = require("./common-events");
/**
 * Build messages from message data to be consumed by the event bus and emitted to the consumer
 * @param MessageFormat
 * @param options
 */
function buildEventMessages(messageData, options) {
    var messageData_ = Array.isArray(messageData) ? messageData : [messageData];
    var messages = [];
    messageData_.map(function (data) {
        var data_ = Array.isArray(data.data) ? data.data : [data.data];
        data_.forEach(function (bodyData) {
            var message = composeMessage(data.eventName, {
                data: bodyData,
                service: data.metadata.service,
                entity: data.metadata.object,
                action: data.metadata.action,
                context: {
                    eventGroupId: data.metadata.eventGroupId,
                },
                options: options,
            });
            messages.push(message);
        });
    });
    return messages;
}
exports.buildEventMessages = buildEventMessages;
/**
 * Helper function to compose and normalize a Message to be emitted by EventBus Module
 * @param eventName  Name of the event to be emitted
 * @param data The content of the message
 * @param metadata Metadata of the message
 * @param context Context from the caller service
 * @param options Options to be passed to the event bus
 */
function composeMessage(eventName, _a) {
    var data = _a.data, service = _a.service, entity = _a.entity, action = _a.action, _b = _a.context, context = _b === void 0 ? {} : _b, options = _a.options;
    var act = action || eventName.split(".").pop();
    if (!action && !Object.values(common_events_1.CommonEvents).includes(act)) {
        throw new Error("Action is required if eventName is not a CommonEvent");
    }
    var metadata = {
        service: service,
        object: entity,
        action: act,
    };
    if (context.eventGroupId) {
        metadata.eventGroupId = context.eventGroupId;
    }
    return {
        eventName: eventName,
        body: {
            metadata: metadata,
            data: data,
        },
        options: options,
    };
}
exports.composeMessage = composeMessage;
//# sourceMappingURL=build-event-messages.js.map
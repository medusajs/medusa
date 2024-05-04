"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEvents = void 0;
var event_bus_1 = require("../event-bus");
exports.UserEvents = {
    created: "user." + event_bus_1.CommonEvents.CREATED,
    updated: "user." + event_bus_1.CommonEvents.UPDATED,
    invite_created: "invite." + event_bus_1.CommonEvents.CREATED,
    invite_updated: "invite." + event_bus_1.CommonEvents.UPDATED,
    invite_token_generated: "invite.token_generated",
};
//# sourceMappingURL=events.js.map
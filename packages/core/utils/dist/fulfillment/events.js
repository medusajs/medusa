"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FulfillmentEvents = void 0;
var event_bus_1 = require("../event-bus");
var eventBaseNames = [
    "fulfillmentSet",
    "serviceZone",
    "geoZone",
    "shippingOption",
    "shippingProfile",
    "shippingOptionRule",
    "fulfillment",
];
exports.FulfillmentEvents = (0, event_bus_1.buildEventNamesFromEntityName)(eventBaseNames);
//# sourceMappingURL=events.js.map
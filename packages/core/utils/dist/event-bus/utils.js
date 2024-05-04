"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildEventNamesFromEntityName = void 0;
var common_1 = require("../common");
var common_events_1 = require("./common-events");
/**
 * From the given strings it will produce the event names accordingly.
 * the result will look like:
 * input: 'serviceZone'
 * output: {
 *   created: 'fulfillment-set.created',
 *   updated: 'fulfillment-set.updated',
 *   deleted: 'fulfillment-set.deleted',
 *   restored: 'fulfillment-set.restored',
 *   attached: 'fulfillment-set.attached',
 *   detached: 'fulfillment-set.detached',
 *   service_zone_created: 'service-zone.created',
 *   service_zone_updated: 'service-zone.updated',
 *   service_zone_deleted: 'service-zone.deleted',
 *   service_zone_restored: 'service-zone.restored',
 *   service_zone_attached: 'service-zone.attached',
 *   service_zone_detached: 'service-zone.detached',
 *   ...
 * }
 *
 * @param names
 */
function buildEventNamesFromEntityName(names) {
    var e_1, _a, e_2, _b;
    var events = {};
    for (var i = 0; i < names.length; i++) {
        var name_1 = names[i];
        var snakedCaseName = (0, common_1.lowerCaseFirst)((0, common_1.camelToSnakeCase)(name_1));
        var kebabCaseName = (0, common_1.lowerCaseFirst)((0, common_1.kebabCase)(name_1));
        if (i === 0) {
            try {
                for (var _c = (e_1 = void 0, __values(Object.values(common_events_1.CommonEvents))), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var event_1 = _d.value;
                    events[event_1] = "".concat(kebabCaseName, ".").concat(event_1);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            continue;
        }
        try {
            for (var _e = (e_2 = void 0, __values(Object.values(common_events_1.CommonEvents))), _f = _e.next(); !_f.done; _f = _e.next()) {
                var event_2 = _f.value;
                events["".concat(snakedCaseName, "_").concat(event_2)] =
                    "".concat(kebabCaseName, ".").concat(event_2);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    return events;
}
exports.buildEventNamesFromEntityName = buildEventNamesFromEntityName;
//# sourceMappingURL=utils.js.map
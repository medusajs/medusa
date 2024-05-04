"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Searchable = void 0;
var core_1 = require("@mikro-orm/core");
function Searchable() {
    return function (target, propertyName) {
        var meta = core_1.MetadataStorage.getMetadataFromDecorator(target.constructor);
        var prop = meta.properties[propertyName] || {};
        prop["searchable"] = true;
        meta.properties[prop.name] = prop;
    };
}
exports.Searchable = Searchable;
//# sourceMappingURL=searchable.js.map
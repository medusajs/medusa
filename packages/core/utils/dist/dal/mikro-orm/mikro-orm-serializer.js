"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mikroOrmSerializer = exports.EntitySerializer = void 0;
var core_1 = require("@mikro-orm/core");
function isVisible(meta, propName, options) {
    var _a, _b;
    if (options === void 0) { options = {}; }
    if (options.populate === true) {
        return options.populate;
    }
    if (Array.isArray(options.populate) &&
        ((_a = options.populate) === null || _a === void 0 ? void 0 : _a.find(function (item) { return item === propName || item.startsWith(propName + "."); }))) {
        return true;
    }
    if ((_b = options.exclude) === null || _b === void 0 ? void 0 : _b.find(function (item) { return item === propName; })) {
        return false;
    }
    var prop = meta.properties[propName];
    var visible = prop && !prop.hidden;
    var prefixed = prop && !prop.primary && propName.startsWith("_"); // ignore prefixed properties, if it's not a PK
    return visible && !prefixed;
}
function isPopulated(entity, propName, options) {
    var _a;
    if (typeof options.populate !== "boolean" &&
        ((_a = options.populate) === null || _a === void 0 ? void 0 : _a.find(function (item) { return item === propName || item.startsWith(propName + "."); }))) {
        return true;
    }
    if (typeof options.populate === "boolean") {
        return options.populate;
    }
    return false;
}
/**
 * Customer property filtering for the serialization which takes into account the parent entity to filter out circular references if configured for.
 * @param propName
 * @param meta
 * @param options
 * @param parent
 */
function filterEntityPropToSerialize(propName, meta, options, parent) {
    if (options === void 0) { options = {}; }
    var isVisibleRes = isVisible(meta, propName, options);
    var prop = meta.properties[propName];
    // Only prevent circular references if prop is a relation
    if (prop &&
        options.preventCircularRef &&
        isVisibleRes &&
        parent &&
        prop.reference !== core_1.ReferenceType.SCALAR) {
        // mapToPk would represent a foreign key and we want to keep them
        return !!prop.mapToPk || parent.constructor.name !== prop.type;
    }
    return isVisibleRes;
}
var EntitySerializer = /** @class */ (function () {
    function EntitySerializer() {
    }
    EntitySerializer.serialize = function (entity, options, parent) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var wrapped = (0, core_1.helper)(entity);
        var meta = wrapped.__meta;
        var contextCreated = false;
        if (!wrapped.__serializationContext.root) {
            var root_1 = new core_1.SerializationContext();
            core_1.SerializationContext.propagate(root_1, entity, function (meta, prop) { var _a; return ((_a = meta.properties[prop]) === null || _a === void 0 ? void 0 : _a.reference) !== core_1.ReferenceType.SCALAR; });
            contextCreated = true;
        }
        var root = wrapped.__serializationContext.root;
        var ret = {};
        var keys = new Set(meta.primaryKeys);
        Object.keys(entity).forEach(function (prop) { return keys.add(prop); });
        var visited = root.visited.has(entity);
        if (!visited) {
            root.visited.add(entity);
        }
        ;
        __spreadArray([], __read(keys), false).filter(function (prop) {
            return filterEntityPropToSerialize(prop, meta, options, parent);
        })
            .map(function (prop) {
            var cycle = root.visit(meta.className, prop);
            if (cycle && visited) {
                return [prop, undefined];
            }
            var val = _this.processProperty(prop, entity, options);
            if (!cycle) {
                root.leave(meta.className, prop);
            }
            if (options.skipNull && core_1.Utils.isPlainObject(val)) {
                core_1.Utils.dropUndefinedProperties(val, null);
            }
            return [prop, val];
        })
            .filter(function (_a) {
            var _b = __read(_a, 2), value = _b[1];
            return typeof value !== "undefined" && !(value === null && options.skipNull);
        })
            .forEach(function (_a) {
            var _b = __read(_a, 2), prop = _b[0], value = _b[1];
            return (ret[_this.propertyName(meta, prop, wrapped.__platform)] = value);
        });
        if (contextCreated) {
            root.close();
        }
        if (!wrapped.isInitialized()) {
            return ret;
        }
        // decorated getters
        meta.props
            .filter(function (prop) {
            return prop.getter &&
                prop.getterName === undefined &&
                typeof entity[prop.name] !== "undefined" &&
                isVisible(meta, prop.name, options);
        })
            .forEach(function (prop) {
            return (ret[_this.propertyName(meta, prop.name, wrapped.__platform)] =
                _this.processProperty(prop.name, entity, options));
        });
        // decorated get methods
        meta.props
            .filter(function (prop) {
            return prop.getterName &&
                entity[prop.getterName] instanceof Function &&
                isVisible(meta, prop.name, options);
        })
            .forEach(function (prop) {
            return (ret[_this.propertyName(meta, prop.name, wrapped.__platform)] =
                _this.processProperty(prop.getterName, entity, options));
        });
        return ret;
    };
    EntitySerializer.propertyName = function (meta, prop, platform) {
        var _a, _b;
        /* istanbul ignore next */
        if ((_a = meta.properties[prop]) === null || _a === void 0 ? void 0 : _a.serializedName) {
            return meta.properties[prop].serializedName;
        }
        if (((_b = meta.properties[prop]) === null || _b === void 0 ? void 0 : _b.primary) && platform) {
            return platform.getSerializedPrimaryKeyField(prop);
        }
        return prop;
    };
    EntitySerializer.processProperty = function (prop, entity, options) {
        var parts = prop.split(".");
        prop = parts[0];
        var wrapped = (0, core_1.helper)(entity);
        var property = wrapped.__meta.properties[prop];
        var serializer = property === null || property === void 0 ? void 0 : property.serializer;
        // getter method
        if (entity[prop] instanceof Function) {
            var returnValue = entity[prop]();
            if (!options.ignoreSerializers && serializer) {
                return serializer(returnValue);
            }
            return returnValue;
        }
        /* istanbul ignore next */
        if (!options.ignoreSerializers && serializer) {
            return serializer(entity[prop]);
        }
        if (core_1.Utils.isCollection(entity[prop])) {
            return this.processCollection(prop, entity, options);
        }
        if (core_1.Utils.isEntity(entity[prop], true)) {
            return this.processEntity(prop, entity, wrapped.__platform, options);
        }
        /* istanbul ignore next */
        if ((property === null || property === void 0 ? void 0 : property.reference) === core_1.ReferenceType.EMBEDDED) {
            if (Array.isArray(entity[prop])) {
                return entity[prop].map(function (item) {
                    return (0, core_1.helper)(item).toJSON();
                });
            }
            if (core_1.Utils.isObject(entity[prop])) {
                return (0, core_1.helper)(entity[prop]).toJSON();
            }
        }
        var customType = property === null || property === void 0 ? void 0 : property.customType;
        if (customType) {
            return customType.toJSON(entity[prop], wrapped.__platform);
        }
        return wrapped.__platform.normalizePrimaryKey(entity[prop]);
    };
    EntitySerializer.extractChildOptions = function (options, prop) {
        var extractChildElements = function (items) {
            return items
                .filter(function (field) { return field.startsWith("".concat(prop, ".")); })
                .map(function (field) { return field.substring(prop.length + 1); });
        };
        return __assign(__assign({}, options), { populate: Array.isArray(options.populate)
                ? extractChildElements(options.populate)
                : options.populate, exclude: Array.isArray(options.exclude)
                ? extractChildElements(options.exclude)
                : options.exclude });
    };
    EntitySerializer.processEntity = function (prop, entity, platform, options) {
        var child = core_1.Reference.unwrapReference(entity[prop]);
        var wrapped = (0, core_1.helper)(child);
        var populated = isPopulated(child, prop, options) && wrapped.isInitialized();
        var expand = populated || options.forceObject || !wrapped.__managed;
        if (expand) {
            return this.serialize(child, this.extractChildOptions(options, prop), 
            /** passing the entity as the parent for circular filtering **/
            entity);
        }
        return platform.normalizePrimaryKey(wrapped.getPrimaryKey());
    };
    EntitySerializer.processCollection = function (prop, entity, options) {
        var _this = this;
        var col = entity[prop];
        if (!col.isInitialized()) {
            return undefined;
        }
        return col.getItems(false).map(function (item) {
            if (isPopulated(item, prop, options)) {
                return _this.serialize(item, _this.extractChildOptions(options, prop), 
                /** passing the entity as the parent for circular filtering **/
                entity);
            }
            return (0, core_1.helper)(item).getPrimaryKey();
        });
    };
    return EntitySerializer;
}());
exports.EntitySerializer = EntitySerializer;
var mikroOrmSerializer = function (data, options) {
    options !== null && options !== void 0 ? options : (options = {});
    var data_ = (Array.isArray(data) ? data : [data]).filter(Boolean);
    var forSerialization = [];
    var notForSerialization = [];
    data_.forEach(function (object) {
        if (object.__meta) {
            return forSerialization.push(object);
        }
        return notForSerialization.push(object);
    });
    var result = forSerialization.map(function (entity) {
        return EntitySerializer.serialize(entity, __assign({ forceObject: true, populate: true, preventCircularRef: true }, options));
    });
    if (notForSerialization.length) {
        result = result.concat(notForSerialization);
    }
    return Array.isArray(data) ? result : result[0];
};
exports.mikroOrmSerializer = mikroOrmSerializer;
//# sourceMappingURL=mikro-orm-serializer.js.map
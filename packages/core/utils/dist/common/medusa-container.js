"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMedusaContainer = void 0;
var awilix_1 = require("awilix");
function asArray(resolvers) {
    return {
        resolve: function (container) {
            return resolvers.map(function (resolver) { return container.build(resolver); });
        },
    };
}
function registerAdd(name, registration) {
    var storeKey = name + "_STORE";
    if (this.registrations[storeKey] === undefined) {
        this.register(storeKey, (0, awilix_1.asValue)([]));
    }
    var store = this.resolve(storeKey);
    if (this.registrations[name] === undefined) {
        this.register(name, asArray(store));
    }
    store.unshift(registration);
    return this;
}
function createMedusaContainer() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var container = awilix_1.createContainer.apply(null, args);
    container.registerAdd = registerAdd.bind(container);
    var originalScope = container.createScope;
    container.createScope = function () {
        var scoped = originalScope();
        scoped.registerAdd = registerAdd.bind(scoped);
        return scoped;
    };
    return container;
}
exports.createMedusaContainer = createMedusaContainer;
//# sourceMappingURL=medusa-container.js.map
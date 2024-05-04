"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractAuthModuleProvider = void 0;
var common_1 = require("../common");
var AbstractAuthModuleProvider = /** @class */ (function () {
    function AbstractAuthModuleProvider(_a, config) {
        var scopes = _a.scopes;
        var _b, _c;
        var _d, _e;
        this.container_ = arguments[0];
        this.scopes_ = scopes;
        (_b = (_d = this.constructor).PROVIDER) !== null && _b !== void 0 ? _b : (_d.PROVIDER = config.provider);
        (_c = (_e = this.constructor).DISPLAY_NAME) !== null && _c !== void 0 ? _c : (_e.DISPLAY_NAME = config.displayName);
    }
    Object.defineProperty(AbstractAuthModuleProvider.prototype, "provider", {
        get: function () {
            return this.constructor.PROVIDER;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractAuthModuleProvider.prototype, "displayName", {
        get: function () {
            return this.constructor.DISPLAY_NAME;
        },
        enumerable: false,
        configurable: true
    });
    AbstractAuthModuleProvider.prototype.validateScope = function (scope) {
        if (!this.scopes_[scope]) {
            throw new common_1.MedusaError(common_1.MedusaError.Types.INVALID_ARGUMENT, "Scope \"".concat(scope, "\" is not valid for provider ").concat(this.provider));
        }
    };
    AbstractAuthModuleProvider.prototype.withScope = function (scope) {
        this.validateScope(scope);
        var cloned = new this.constructor(this.container_);
        cloned.scope_ = scope;
        cloned.scopeConfig_ = this.scopes_[scope];
        return cloned;
    };
    AbstractAuthModuleProvider.prototype.validateCallback = function (data) {
        throw new Error("Callback authentication not implemented for provider ".concat(this.provider));
    };
    return AbstractAuthModuleProvider;
}());
exports.AbstractAuthModuleProvider = AbstractAuthModuleProvider;
//# sourceMappingURL=abstract-auth-provider.js.map
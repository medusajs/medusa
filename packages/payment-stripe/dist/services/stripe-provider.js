"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var stripe_base_1 = __importDefault(require("../core/stripe-base"));
var types_1 = require("../types");
var StripeProviderService = /** @class */ (function (_super) {
    __extends(StripeProviderService, _super);
    function StripeProviderService(_, options) {
        return _super.call(this, _, options) || this;
    }
    Object.defineProperty(StripeProviderService.prototype, "paymentIntentOptions", {
        get: function () {
            return {};
        },
        enumerable: false,
        configurable: true
    });
    StripeProviderService.PROVIDER = types_1.PaymentProviderKeys.STRIPE;
    return StripeProviderService;
}(stripe_base_1.default));
exports.default = StripeProviderService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaXBlLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL3N0cmlwZS1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG9FQUE0QztBQUM1QyxrQ0FBb0U7QUFFcEU7SUFBb0MseUNBQVU7SUFHNUMsK0JBQVksQ0FBQyxFQUFFLE9BQU87ZUFDcEIsa0JBQU0sQ0FBQyxFQUFFLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBRUQsc0JBQUksdURBQW9CO2FBQXhCO1lBQ0UsT0FBTyxFQUFFLENBQUE7UUFDWCxDQUFDOzs7T0FBQTtJQVJNLDhCQUFRLEdBQUcsMkJBQW1CLENBQUMsTUFBTSxDQUFBO0lBUzlDLDRCQUFDO0NBQUEsQUFWRCxDQUFvQyxxQkFBVSxHQVU3QztBQUVELGtCQUFlLHFCQUFxQixDQUFBIn0=
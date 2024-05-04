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
var IdealProviderService = /** @class */ (function (_super) {
    __extends(IdealProviderService, _super);
    function IdealProviderService(_, options) {
        return _super.call(this, _, options) || this;
    }
    Object.defineProperty(IdealProviderService.prototype, "paymentIntentOptions", {
        get: function () {
            return {
                payment_method_types: ["ideal"],
                capture_method: "automatic",
            };
        },
        enumerable: false,
        configurable: true
    });
    IdealProviderService.PROVIDER = types_1.PaymentProviderKeys.IDEAL;
    return IdealProviderService;
}(stripe_base_1.default));
exports.default = IdealProviderService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaXBlLWlkZWFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL3N0cmlwZS1pZGVhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG9FQUE0QztBQUM1QyxrQ0FBb0U7QUFFcEU7SUFBbUMsd0NBQVU7SUFHM0MsOEJBQVksQ0FBQyxFQUFFLE9BQU87ZUFDcEIsa0JBQU0sQ0FBQyxFQUFFLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBRUQsc0JBQUksc0RBQW9CO2FBQXhCO1lBQ0UsT0FBTztnQkFDTCxvQkFBb0IsRUFBRSxDQUFDLE9BQU8sQ0FBQztnQkFDL0IsY0FBYyxFQUFFLFdBQVc7YUFDNUIsQ0FBQTtRQUNILENBQUM7OztPQUFBO0lBWE0sNkJBQVEsR0FBRywyQkFBbUIsQ0FBQyxLQUFLLENBQUE7SUFZN0MsMkJBQUM7Q0FBQSxBQWJELENBQW1DLHFCQUFVLEdBYTVDO0FBRUQsa0JBQWUsb0JBQW9CLENBQUEifQ==
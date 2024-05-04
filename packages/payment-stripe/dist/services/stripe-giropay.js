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
var GiropayProviderService = /** @class */ (function (_super) {
    __extends(GiropayProviderService, _super);
    function GiropayProviderService(_, options) {
        return _super.call(this, _, options) || this;
    }
    Object.defineProperty(GiropayProviderService.prototype, "paymentIntentOptions", {
        get: function () {
            return {
                payment_method_types: ["giropay"],
                capture_method: "automatic",
            };
        },
        enumerable: false,
        configurable: true
    });
    GiropayProviderService.PROVIDER = types_1.PaymentProviderKeys.GIROPAY;
    return GiropayProviderService;
}(stripe_base_1.default));
exports.default = GiropayProviderService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaXBlLWdpcm9wYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvc3RyaXBlLWdpcm9wYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvRUFBNEM7QUFDNUMsa0NBQW9FO0FBRXBFO0lBQXFDLDBDQUFVO0lBRzdDLGdDQUFZLENBQUMsRUFBRSxPQUFPO2VBQ3BCLGtCQUFNLENBQUMsRUFBRSxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVELHNCQUFJLHdEQUFvQjthQUF4QjtZQUNFLE9BQU87Z0JBQ0wsb0JBQW9CLEVBQUUsQ0FBQyxTQUFTLENBQUM7Z0JBQ2pDLGNBQWMsRUFBRSxXQUFXO2FBQzVCLENBQUE7UUFDSCxDQUFDOzs7T0FBQTtJQVhNLCtCQUFRLEdBQUcsMkJBQW1CLENBQUMsT0FBTyxDQUFBO0lBWS9DLDZCQUFDO0NBQUEsQUFiRCxDQUFxQyxxQkFBVSxHQWE5QztBQUVELGtCQUFlLHNCQUFzQixDQUFBIn0=
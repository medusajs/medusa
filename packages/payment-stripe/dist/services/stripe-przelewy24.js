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
var Przelewy24ProviderService = /** @class */ (function (_super) {
    __extends(Przelewy24ProviderService, _super);
    function Przelewy24ProviderService(_, options) {
        return _super.call(this, _, options) || this;
    }
    Object.defineProperty(Przelewy24ProviderService.prototype, "paymentIntentOptions", {
        get: function () {
            return {
                payment_method_types: ["p24"],
                capture_method: "automatic",
            };
        },
        enumerable: false,
        configurable: true
    });
    Przelewy24ProviderService.PROVIDER = types_1.PaymentProviderKeys.PRZELEWY_24;
    return Przelewy24ProviderService;
}(stripe_base_1.default));
exports.default = Przelewy24ProviderService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaXBlLXByemVsZXd5MjQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvc3RyaXBlLXByemVsZXd5MjQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvRUFBNEM7QUFDNUMsa0NBQW9FO0FBRXBFO0lBQXdDLDZDQUFVO0lBR2hELG1DQUFZLENBQUMsRUFBRSxPQUFPO2VBQ3BCLGtCQUFNLENBQUMsRUFBRSxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVELHNCQUFJLDJEQUFvQjthQUF4QjtZQUNFLE9BQU87Z0JBQ0wsb0JBQW9CLEVBQUUsQ0FBQyxLQUFLLENBQUM7Z0JBQzdCLGNBQWMsRUFBRSxXQUFXO2FBQzVCLENBQUE7UUFDSCxDQUFDOzs7T0FBQTtJQVhNLGtDQUFRLEdBQUcsMkJBQW1CLENBQUMsV0FBVyxDQUFBO0lBWW5ELGdDQUFDO0NBQUEsQUFiRCxDQUF3QyxxQkFBVSxHQWFqRDtBQUVELGtCQUFlLHlCQUF5QixDQUFBIn0=
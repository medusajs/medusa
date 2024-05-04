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
var BlikProviderService = /** @class */ (function (_super) {
    __extends(BlikProviderService, _super);
    function BlikProviderService(_, options) {
        return _super.call(this, _, options) || this;
    }
    Object.defineProperty(BlikProviderService.prototype, "paymentIntentOptions", {
        get: function () {
            return {
                payment_method_types: ["blik"],
                capture_method: "automatic",
            };
        },
        enumerable: false,
        configurable: true
    });
    BlikProviderService.PROVIDER = types_1.PaymentProviderKeys.BLIK;
    return BlikProviderService;
}(stripe_base_1.default));
exports.default = BlikProviderService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaXBlLWJsaWsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvc3RyaXBlLWJsaWsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvRUFBNEM7QUFDNUMsa0NBQW9FO0FBRXBFO0lBQWtDLHVDQUFVO0lBRzFDLDZCQUFZLENBQUMsRUFBRSxPQUFPO2VBQ3BCLGtCQUFNLENBQUMsRUFBRSxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVELHNCQUFJLHFEQUFvQjthQUF4QjtZQUNFLE9BQU87Z0JBQ0wsb0JBQW9CLEVBQUUsQ0FBQyxNQUFNLENBQUM7Z0JBQzlCLGNBQWMsRUFBRSxXQUFXO2FBQzVCLENBQUE7UUFDSCxDQUFDOzs7T0FBQTtJQVhNLDRCQUFRLEdBQUcsMkJBQW1CLENBQUMsSUFBSSxDQUFBO0lBWTVDLDBCQUFDO0NBQUEsQUFiRCxDQUFrQyxxQkFBVSxHQWEzQztBQUVELGtCQUFlLG1CQUFtQixDQUFBIn0=
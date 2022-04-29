"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Auth = __importStar(require("../../generated/store/auth/auth"));
var Cart = __importStar(require("../../generated/store/cart/cart"));
var Collection = __importStar(require("../../generated/store/collection/collection"));
var Customer = __importStar(require("../../generated/store/customer/customer"));
var GiftCard = __importStar(require("../../generated/store/gift-card/gift-card"));
var Order = __importStar(require("../../generated/store/order/order"));
var Product = __importStar(require("../../generated/store/product/product"));
var ProductVariant = __importStar(require("../../generated/store/product-variant/product-variant"));
var Region = __importStar(require("../../generated/store/region/region"));
var Return = __importStar(require("../../generated/store/return/return"));
var ReturnReason = __importStar(require("../../generated/store/return-reason/return-reason"));
var ShippingOption = __importStar(require("../../generated/store/shipping-option/shipping-option"));
var Swap = __importStar(require("../../generated/store/swap/swap"));
var Medusa = /** @class */ (function () {
    function Medusa() {
        this.auth = Auth;
        this.carts = Cart;
        this.collections = Collection;
        this.customers = Customer;
        this.giftCards = GiftCard;
        this.orders = Order;
        this.products = Product;
        this.variants = ProductVariant;
        this.regions = Region;
        this.returns = Return;
        this.returnReasons = ReturnReason;
        this.shippingOptions = ShippingOption;
        this.swaps = Swap;
    }
    return Medusa;
}());
exports.default = Medusa;
//# sourceMappingURL=store.js.map
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
var Apps = __importStar(require("../../generated/admin/apps/apps"));
var Auth = __importStar(require("../../generated/admin/auth/auth"));
var Claim = __importStar(require("../../generated/admin/claim/claim"));
var Collection = __importStar(require("../../generated/admin/collection/collection"));
var Customer = __importStar(require("../../generated/admin/customer/customer"));
var CustomerGroup = __importStar(require("../../generated/admin/customer-group/customer-group"));
var Discount = __importStar(require("../../generated/admin/discount/discount"));
var DraftOrder = __importStar(require("../../generated/admin/draft-order/draft-order"));
var Fulfillment = __importStar(require("../../generated/admin/fulfillment/fulfillment"));
var GiftCard = __importStar(require("../../generated/admin/gift-card/gift-card"));
var Invite = __importStar(require("../../generated/admin/invites/invites"));
var Note = __importStar(require("../../generated/admin/note/note"));
var Notification = __importStar(require("../../generated/admin/notification/notification"));
var Order = __importStar(require("../../generated/admin/order/order"));
var Product = __importStar(require("../../generated/admin/product/product"));
var ProductTag = __importStar(require("../../generated/admin/product-tag/product-tag"));
var ProductVariant = __importStar(require("../../generated/admin/product-variant/product-variant"));
var Region = __importStar(require("../../generated/admin/region/region"));
var Return = __importStar(require("../../generated/admin/return/return"));
var ReturnReason = __importStar(require("../../generated/admin/return-reason/return-reason"));
var ShippingOption = __importStar(require("../../generated/admin/shipping-option/shipping-option"));
var ShippingProfile = __importStar(require("../../generated/admin/shipping-profile/shipping-profile"));
var Store = __importStar(require("../../generated/admin/store/store"));
var Swap = __importStar(require("../../generated/admin/swap/swap"));
var TaxRate = __importStar(require("../../generated/admin/tax-rates/tax-rates"));
var Upload = __importStar(require("../../generated/admin/uploads/uploads"));
var User = __importStar(require("../../generated/admin/users/users"));
var PriceList = __importStar(require("../../generated/admin/price-list/price-list"));
var MedusaAdmin = /** @class */ (function () {
    function MedusaAdmin() {
        this.apps = Apps;
        this.auth = Auth;
        this.claims = Claim;
        this.collections = Collection;
        this.customers = Customer;
        this.customerGroups = CustomerGroup;
        this.discounts = Discount;
        this.draftOrders = DraftOrder;
        this.fulfillments = Fulfillment;
        this.giftCards = GiftCard;
        this.invites = Invite;
        this.notes = Note;
        this.notifications = Notification;
        this.orders = Order;
        this.products = Product;
        this.tags = ProductTag;
        this.variants = ProductVariant;
        this.regions = Region;
        this.returns = Return;
        this.returnReasons = ReturnReason;
        this.shippingOptions = ShippingOption;
        this.shippingProfiles = ShippingProfile;
        this.stores = Store;
        this.swaps = Swap;
        this.taxRates = TaxRate;
        this.uploads = Upload;
        this.users = User;
        this.priceLists = PriceList;
    }
    return MedusaAdmin;
}());
exports.default = MedusaAdmin;
//# sourceMappingURL=admin.js.map
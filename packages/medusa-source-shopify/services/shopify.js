"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _medusaInterfaces = require("medusa-interfaces");

var _lodash = _interopRequireDefault(require("lodash"));

var _const = require("../utils/const");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ShopifyService = /*#__PURE__*/function (_BaseService) {
  _inherits(ShopifyService, _BaseService);

  var _super = _createSuper(ShopifyService);

  function ShopifyService(_ref, options) {
    var _this;

    var manager = _ref.manager,
        shippingProfileService = _ref.shippingProfileService,
        shopifyProductService = _ref.shopifyProductService,
        shopifyCollectionService = _ref.shopifyCollectionService,
        shopifyClientService = _ref.shopifyClientService;

    _classCallCheck(this, ShopifyService);

    _this = _super.call(this);
    _this.options = options;
    /** @private @const {EntityManager} */

    _this.manager_ = manager; // /** @private @const {LineItemService} */
    // this.lineItemService_ = lineItemService
    // /** @private @const {ProductService} */
    // this.productService_ = productService
    // /** @private @const {ProductVariantService} */
    // this.productVariantService_ = productVariantService
    // /** @private @const {ProductCollectionService} */
    // this.collectionService_ = productCollectionService

    /** @private @const {ShippingProfileService} */

    _this.shippingProfileService_ = shippingProfileService; // /** @private @const {CustomerService} */
    // this.customerService_ = customerService
    // /** @private @const {OrderService} */
    // this.orderService_ = orderService
    // /** @private @const {FulfillmentService} */
    // this.fulfillmentService_ = fulfillmentService
    // /** @private @const {RegionService} */
    // this.regionService_ = regionService
    // /** @private @const {PaymentRepository} */
    // this.paymentRepository_ = paymentRepository
    // /** @private @const {OrderRepository} */
    // this.orderRepository_ = orderRepository

    /** @private @const {ShopifyRestClient} */

    _this.client_ = shopifyClientService;
    /** @private @const {ShopifyProductService} */

    _this.productService_ = shopifyProductService;
    /** @private @const {ShopifyCollectionService} */

    _this.collectionService_ = shopifyCollectionService;
    /** @private @const {ShopifyRestClient} */

    _this.client_ = shopifyClientService;
    return _this;
  }

  _createClass(ShopifyService, [{
    key: "withTransaction",
    value: function withTransaction(transactionManager) {
      if (!transactionManager) {
        return this;
      }

      var cloned = new ShopifyService({
        manager: transactionManager,
        options: this.options,
        // orderService: this.orderService_,
        // customerService: this.customerService_,
        // productCollectionService: this.collectionService_,
        shippingProfileService: this.shippingProfileService_,
        shopifyClientService: this.client_,
        shopifyProductService: this.productService_,
        shopifyCollectionService: this.collectionService_ // productVariantRepository: this.productVariantRepository_,
        // productService: this.productService_,
        // regionService: this.regionService_,
        // paymentRepository: this.paymentRepository_,

      });
      cloned.transactionManager_ = transactionManager;
      return cloned;
    }
  }, {
    key: "importShopify",
    value: function () {
      var _importShopify = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(manager) {
                    var products, customCollections, smartCollections, collects, _iterator, _step, product;

                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return _this2.shippingProfileService_.createDefault();

                          case 2:
                            _context.next = 4;
                            return _this2.shippingProfileService_.createGiftCardDefault();

                          case 4:
                            _context.next = 6;
                            return _this2.client_.list("products", _const.INCLUDE_PRESENTMENT_PRICES);

                          case 6:
                            products = _context.sent;
                            _context.next = 9;
                            return _this2.client_.list("custom_collections");

                          case 9:
                            customCollections = _context.sent;
                            _context.next = 12;
                            return _this2.client_.list("smart_collections");

                          case 12:
                            smartCollections = _context.sent;
                            _context.next = 15;
                            return _this2.client_.list("collects");

                          case 15:
                            collects = _context.sent;
                            _context.next = 18;
                            return _this2.collectionService_.withTransaction(manager).createWithProducts(collects, [].concat(_toConsumableArray(customCollections), _toConsumableArray(smartCollections)), products);

                          case 18:
                            _iterator = _createForOfIteratorHelper(products);
                            _context.prev = 19;

                            _iterator.s();

                          case 21:
                            if ((_step = _iterator.n()).done) {
                              _context.next = 27;
                              break;
                            }

                            product = _step.value;
                            _context.next = 25;
                            return _this2.productService_.withTransaction(manager).create(product);

                          case 25:
                            _context.next = 21;
                            break;

                          case 27:
                            _context.next = 32;
                            break;

                          case 29:
                            _context.prev = 29;
                            _context.t0 = _context["catch"](19);

                            _iterator.e(_context.t0);

                          case 32:
                            _context.prev = 32;

                            _iterator.f();

                            return _context.finish(32);

                          case 35:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee, null, [[19, 29, 32, 35]]);
                  }));

                  return function (_x) {
                    return _ref2.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function importShopify() {
        return _importShopify.apply(this, arguments);
      }

      return importShopify;
    }() // async createCollectionsWithProducts(
    //   collects,
    //   normalizedCollections,
    //   products
    // ) {
    //   return this.atomicPhase_(async (manager) => {
    //     return Promise.all(
    //       normalizedCollections.map(async (nc) => {
    //         let collection = await this.collectionService_
    //           .retrieveByHandle(nc.handle)
    //           .catch((_) => undefined)
    //         if (!collection) {
    //           collection = await this.collectionService_
    //             .withTransaction(manager)
    //             .create(nc)
    //         }
    //         const productIds = collects.reduce((productIds, c) => {
    //           if (c.collection_id === collection.metadata.sh_id) {
    //             productIds.push(c.product_id)
    //           }
    //           return productIds
    //         }, [])
    //         const reducedProducts = products.reduce((reducedProducts, p) => {
    //           if (productIds.includes(p.id)) {
    //             reducedProducts.push(p)
    //             /**
    //              * As we only support products belonging to one collection,
    //              * we need to remove the product from the list of products
    //              * to prevent trying to add a product to several collections.
    //              * This is done on a first-come basis, so once a product belongs
    //              * to a collection, it is then removed from the list of products
    //              * that still needs to be imported.
    //              */
    //             removeIndex(products, p)
    //           }
    //           return reducedProducts
    //         }, [])
    //         return Promise.all(
    //           reducedProducts.map(async (rp) => {
    //             try {
    //               await this.createProduct(rp, collection.id)
    //             } catch (_err) {
    //               console.log(`${rp.title} already exists. Skipping`)
    //             }
    //           })
    //         )
    //       })
    //     )
    //   })
    // }
    // async createProduct(productOrId, collectionId) {
    //   return this.atomicPhase_(async (manager) => {
    //     let product
    //     let shippingProfile
    //     if (typeof productOrId === "number") {
    //       /**
    //        * Events related to products only contain a ID for the product
    //        * related to the event, so we need to fetch the product.
    //        */
    //       product = await this.client_.get({
    //         path: `products/${productOrId}`,
    //         extraHeaders: INCLUDE_PRESENTMENT_PRICES,
    //       })
    //     } else {
    //       product = productOrId
    //     }
    //     const normalizedProduct = this.normalizeProduct(product, collectionId)
    //     // Get default shipping profile
    //     if (normalizedProduct.is_giftcard) {
    //       shippingProfile = await this.shippingProfileService_.retrieveGiftCardDefault()
    //     } else {
    //       shippingProfile = await this.shippingProfileService_.retrieveDefault()
    //     }
    //     const variants = normalizedProduct.variants
    //     delete normalizedProduct.variants
    //     normalizedProduct.profile_id = shippingProfile
    //     const newProd = await this.productService_
    //       .withTransaction(manager)
    //       .create(normalizedProduct)
    //     if (variants && variants.length) {
    //       const optionIds = normalizedProduct.options.map(
    //         (o) => newProd.options.find((newO) => newO.title === o.title).id
    //       )
    //       for (const v of variants) {
    //         const variant = {
    //           ...v,
    //           options: v.options.map((o, index) => ({
    //             ...o,
    //             option_id: optionIds[index],
    //           })),
    //         }
    //         await this.productVariantService_
    //           .withTransaction(manager)
    //           .create(newProd.id, variant)
    //       }
    //     }
    //   })
    // }
    // async createCustomer(customer, shippingAddress, billingAddress) {
    //   return this.atomicPhase_(async (manager) => {
    //     const existingCustomer = await this.customerService_
    //       .retrieveByEmail(customer.email)
    //       .catch((_err) => undefined)
    //     if (existingCustomer) {
    //       return existingCustomer
    //     }
    //     const normalizedCustomer = this.normalizeCustomer(
    //       customer,
    //       shippingAddress,
    //       billingAddress
    //     )
    //     let normalizedBilling = normalizedCustomer.billing_address
    //     let normalizedShipping = normalizedCustomer.shipping_address
    //     delete normalizedCustomer.billing_address
    //     delete normalizedCustomer.shipping_address
    //     const medusaCustomer = await this.customerService_
    //       .withTransaction(manager)
    //       .create(normalizedCustomer)
    //     await this.customerService_
    //       .withTransaction(manager)
    //       .addAddress(medusaCustomer.id, normalizedShipping)
    //       .catch((e) =>
    //         console.log(
    //           "Failed on creating shipping address",
    //           e,
    //           normalizedShipping
    //         )
    //       )
    //     const result = await this.customerService_
    //       .withTransaction(manager)
    //       .update(medusaCustomer.id, {
    //         billing_address: normalizedBilling,
    //       })
    //       .catch((e) =>
    //         console.log(
    //           "Failed on creating billing address",
    //           e,
    //           normalizedBilling
    //         )
    //       )
    //     return result
    //   })
    // }
    // async addShippingMethod(shippingLine, orderId, taxRate) {
    //   const soId = "so_01FH3KPZ9TWTDPB6EQ4ZE7N0NJ" //temp
    //   return this.atomicPhase_(async (manager) => {
    //     const order = await this.orderService_
    //       .withTransaction(manager)
    //       .addShippingMethod(
    //         orderId,
    //         soId,
    //         {},
    //         {
    //           price: parsePrice(shippingLine.price) * (1 - taxRate),
    //         }
    //       )
    //     return order
    //   })
    // }
    // async getRegion(countryCode) {
    //   try {
    //     return await this.regionService_.retrieveByCountryCode(
    //       countryCode.toLowerCase()
    //     )
    //   } catch (_err) {
    //     return null
    //   }
    // }
    // getShopifyTaxRate(taxLines) {
    //   return taxLines[0].rate || 0
    // }
    // async receiveRefund(refund) {
    //   return {}
    // }
    // async restockItems(lineItems) {
    //   return this.atomicPhase_(async (manager) => {
    //     for (const lineItem of lineItems) {
    //     }
    //   })
    // }
    // async createOrder(order) {
    //   return this.atomicPhase_(async (manager) => {
    //     const { customer, shipping_address, billing_address, tax_lines } = order
    //     const medCustomer = await this.createCustomer(
    //       customer,
    //       shipping_address,
    //       billing_address
    //     )
    //     if (!medCustomer) {
    //       throw new MedusaError(
    //         MedusaError.Types.NOT_FOUND,
    //         `An error occured while attempting to create or retrieve a customer`
    //       )
    //     }
    //     const normalizedOrder = await this.normalizeOrder(order, medCustomer.id)
    //     if (!normalizedOrder) {
    //       throw new MedusaError(
    //         MedusaError.Types.INVALID_DATA,
    //         `An error occurred while normalizing the order`
    //       )
    //     }
    //     const medusaOrder = await this.orderService_
    //       .withTransaction(manager)
    //       .create(normalizedOrder)
    //     await Promise.all(
    //       order.shipping_lines.map(async (sl) =>
    //         this.addShippingMethod(
    //           sl,
    //           medusaOrder.id,
    //           this.getShopifyTaxRate(tax_lines)
    //         )
    //       )
    //     )
    //     await this.createPayment({
    //       order_id: medusaOrder.id,
    //       currency_code: medusaOrder.currency_code,
    //       total: this.getOrderTotal(order),
    //     })
    //   })
    // }
    // async cancelOrder(orderId) {
    //   return this.atomicPhase_(async (manager) => {
    //     const order = this.orderService_.retrieveByExternalId(orderId)
    //     return await this.orderService_.withTransaction(manager).cancel(order.id)
    //   })
    // }
    // async createPayment(data) {
    //   return this.atomicPhase_(async (manager) => {
    //     const paymentRepo = manager.getCustomRepository(this.paymentRepository_)
    //     const created = paymentRepo.create({
    //       provider_id: "shopify",
    //       amount: data.total,
    //       currency_code: data.currency_code,
    //       data: {},
    //       order_id: data.order_id,
    //     })
    //     return paymentRepo.save(created)
    //   })
    // }
    // async updateProduct(product) {
    //   return this.atomicPhase_(async (manager) => {
    //     const medusaProduct = await this.productService_
    //       .retrieveByHandle(product.handle, {
    //         relations: ["variants"],
    //       })
    //       .catch((_) => undefined)
    //     if (!medusaProduct) {
    //       console.log("No product found")
    //       return Promise.resolve({})
    //     }
    //     const { variants } = await this.client_
    //       .get({
    //         path: `products/${product.id}`,
    //         extraHeaders: INCLUDE_PRESENTMENT_PRICES,
    //       })
    //       .then((res) => {
    //         return res.body.product
    //       })
    //     product.variants = variants || []
    //     const normalizedUpdate = this.normalizeProduct(product)
    //     const updates = _.pickBy(normalizedUpdate, Boolean)
    //     updates.variants = await Promise.all(
    //       updates.variants.map(async (v) => {
    //         const match = medusaProduct.variants.find((mv) => mv.sku === v.sku)
    //         if (match) {
    //           let variant = await this.productVariantService_
    //             .withTransaction(manager)
    //             .retrieve(match.id, { relations: ["options"] })
    //           let options = variant.options.map((o, i) => {
    //             return { ...o, ...v.options[i] }
    //           })
    //           v.options = options
    //           v.id = variant.id
    //         }
    //         //errors on update with new variant
    //         return v
    //       })
    //     )
    //     return await this.productService_
    //       .withTransaction(manager)
    //       .update(medusaProduct.id, updates)
    //   })
    // }
    // async deleteProduct(id) {
    //   return this.atomicPhase_(async (manager) => {
    //     const product = await this.productService_
    //       .retrieveByExternalId(id)
    //       .catch((_) => undefined)
    //     if (product) {
    //       await this.productService_.withTransaction(manager).delete(product.id)
    //     }
    //   })
    // }
    // async createFulfillment(data) {
    //   return this.atomicPhase_(async (manager) => {
    //     const {
    //       id,
    //       order_id,
    //       line_items,
    //       tracking_number,
    //       tracking_numbers,
    //       tracking_url,
    //       tracking_urls,
    //     } = data
    //     let order = await this.orderService_
    //       .retrieveByExternalId(order_id, {
    //         relations: ["items"],
    //       })
    //       .catch((_) => undefined)
    //     // if order occured before we began listening for orders to the shop
    //     if (!order) {
    //       const shopifyOrder = this.client_.get({
    //         path: `orders/${order_id}`,
    //         extraHeaders: INCLUDE_PRESENTMENT_PRICES,
    //       })
    //       order = await this.createOrder(shopifyOrder)
    //     }
    //     const itemsToFulfill = line_items.map((l) => {
    //       const match = order.items.find((i) => i.variant.sku === l.sku)
    //       if (!match) {
    //         throw new MedusaError(
    //           MedusaError.Types.INVALID_DATA,
    //           `Error on line item ${l.id}. Missing SKU. Product variants are required to have a SKU code.`
    //         )
    //       }
    //       return { item_id: match.id, quantity: l.quantity }
    //     })
    //     return await this.orderService_
    //       .withTransaction(manager)
    //       .createFulfillment(order.id, itemsToFulfill, {
    //         metadata: {
    //           sh_id: id,
    //           tracking_number,
    //           tracking_numbers,
    //           tracking_url,
    //           tracking_urls,
    //         },
    //       })
    //   })
    // }
    // async updateFulfillment(data) {
    //   return this.atomicPhase_(async (manager) => {
    //     const { id, order_id, status } = data
    //     let order = await this.orderService_
    //       .retrieveByExternalId(order_id, {
    //         relations: ["fulfillments", "items"],
    //       })
    //       .catch((_) => undefined)
    //     if (!order) {
    //       const shopifyOrder = this.client_.get({
    //         path: `orders/${order_id}`,
    //         extraHeaders: INCLUDE_PRESENTMENT_PRICES,
    //       })
    //       order = await this.createOrder(shopifyOrder)
    //     }
    //     const fulfillment = order.fulfillments.find(
    //       (f) => f.metadata.sh_id === id
    //     )
    //     if (status === "cancelled") {
    //       return await this.orderService_
    //         .withTransaction(manager)
    //         .cancelFulfillment(fulfillment.id)
    //     }
    //     if (status === "success") {
    //       //This can happend if a user adds shipping info such as tracking links after creating the fulfillment
    //       return Promise.resolve({})
    //     }
    //   })
    // }
    // async updateOrder(data) {
    //   return this.atomicPhase_(async (manager) => {
    //     const order = await this.orderService_
    //       .withTransaction(manager)
    //       .retrieveByExternalId(data.id, {
    //         relations: ["items", "shipping_address", "customer"],
    //       })
    //     for (const i of data.line_items) {
    //       if (i.fulfillable_quantity === 0) {
    //         removeIndex(data.line_items, i)
    //       }
    //     }
    //     const normalized = await this.normalizeOrder(data, order.customer.id)
    //     let itemUpdates = {
    //       update: [],
    //       add: [],
    //     }
    //     //need to divide line items into three categories
    //     // - delete: LineItem exists in Medusa but not in update
    //     // - update: LineItem exists both in Medusa and in update
    //     // - add: LineItem exists in update but not Medusa
    //     let orderItems = []
    //     for (const i of order.items) {
    //       let variant = await this.productVariantService_
    //         .withTransaction(manager)
    //         .retrieve(i.variant_id)
    //       orderItems.push({ sku: variant.sku, id: i.id })
    //     }
    //     for (const i of data.line_items) {
    //       let match = orderItems.find((oi) => oi.sku === i.sku)
    //       if (match) {
    //         console.log("before normalization")
    //         let normalized = await this.normalizeLineItem(
    //           i,
    //           this.getShopifyTaxRate(data.tax_lines)
    //         )
    //         removeIndex(orderItems, match)
    //         itemUpdates.update.push({ id: match.id, ...normalized })
    //       } else {
    //         let normalized = await this.normalizeLineItem(
    //           i,
    //           this.getShopifyTaxRate(data.tax_lines)
    //         )
    //         itemUpdates.add.push(normalized)
    //       }
    //     }
    //     order.email = data.email
    //     const orderRepo = manager.getCustomRepository(this.orderRepository_)
    //     await orderRepo.save(order)
    //     if (itemUpdates.add.length) {
    //       for (const i of itemUpdates.add) {
    //         await this.lineItemService_
    //           .withTransaction(manager)
    //           .create({ order_id: order.id, ...i })
    //       }
    //     }
    //     if (itemUpdates.update.length) {
    //       for (const i of itemUpdates.update) {
    //         console.log("update to item", { quantity: i.quantity })
    //         const updatedItem = await this.lineItemService_
    //           .withTransaction(manager)
    //           .update(i.id, { quantity: i.quantity })
    //         console.log("result of update", updatedItem)
    //       }
    //     }
    //     if (orderItems.length) {
    //       for (const i of orderItems) {
    //         await this.lineItemService_.withTransaction(manager).delete(i.id)
    //       }
    //     }
    //     await this.orderService_
    //       .withTransaction(manager)
    //       .updateShippingAddress_(order, normalized.shipping_address)
    //   })
    // }
    // async normalizeOrder(shopifyOrder, customerId) {
    //   return this.atomicPhase_(async (manager) => {
    //     const paymentStatus = this.normalizeOrderPaymentStatus(
    //       shopifyOrder.financial_status
    //     )
    //     const fulfillmentStatus = this.normalizeOrderFulfilmentStatus(
    //       shopifyOrder.fulfillment_status
    //     )
    //     const region = await this.getRegion(
    //       shopifyOrder.shipping_address.country_code
    //     )
    //     return {
    //       status: this.normalizeOrderStatus(fulfillmentStatus, paymentStatus),
    //       region_id: region.id,
    //       email: shopifyOrder.email,
    //       customer_id: customerId,
    //       currency_code: shopifyOrder.currency.toLowerCase(),
    //       tax_rate: region.tax_rate,
    //       tax_total: parsePrice(shopifyOrder.total_tax),
    //       subtotal: shopifyOrder.subtotal_price,
    //       shipping_address: this.normalizeAddress(shopifyOrder.shipping_address),
    //       billing_address: this.normalizeAddress(shopifyOrder.billing_address),
    //       discount_total: shopifyOrder.total_discounts,
    //       fulfilment_status: fulfillmentStatus,
    //       payment_status: paymentStatus,
    //       items: await Promise.all(
    //         shopifyOrder.line_items.map(async (i) => {
    //           return this.normalizeLineItem(
    //             i,
    //             this.getShopifyTaxRate(shopifyOrder.tax_lines)
    //           )
    //         })
    //       ),
    //       external_id: shopifyOrder.id,
    //     }
    //   })
    // }
    // getOrderTotal(order) {
    //   const shippingTotal = order.shipping_lines.reduce(
    //     (total, i) => parsePrice(i.price) + total,
    //     0
    //   )
    //   const itemTotal = order.line_items.reduce(
    //     (total, i) => parsePrice(i.price) + total,
    //     0
    //   )
    //   return shippingTotal + itemTotal
    // }
    // async normalizeLineItem(lineItem, taxRate) {
    //   return this.atomicPhase_(async (manager) => {
    //     const productVariant = await this.productVariantService_
    //       .withTransaction(manager)
    //       .retrieveBySKU(lineItem.sku)
    //     return {
    //       title: lineItem.title,
    //       is_giftcard: lineItem.gift_card,
    //       unit_price: parsePrice(lineItem.price) * (1 - taxRate),
    //       quantity: lineItem.quantity,
    //       fulfilled_quantity: lineItem.quantity - lineItem.fulfillable_quantity,
    //       variant_id: productVariant.id,
    //     }
    //   })
    // }
    // normalizeOrderStatus(fulfillmentStatus, paymentStatus) {
    //   if (fulfillmentStatus === "fulfilled" && paymentStatus === "captured") {
    //     return "completed"
    //   } else {
    //     return "pending"
    //   }
    // }
    // normalizeOrderFulfilmentStatus(fulfilmentStatus) {
    //   switch (fulfilmentStatus) {
    //     case null:
    //       return "not_fulfilled"
    //     case "fulfilled":
    //       return "fulfilled"
    //     case "partial":
    //       return "partially_fulfilled"
    //     case "restocked":
    //       return "returned"
    //     case "pending":
    //       return "not_fulfilled"
    //     default:
    //       return "not_fulfilled"
    //   }
    // }
    // normalizeOrderPaymentStatus(financial_status) {
    //   switch (financial_status) {
    //     case "refunded":
    //       return "refunded"
    //     case "voided":
    //       return "canceled"
    //     case "partially_refunded":
    //       return "partially_refunded"
    //     case "partially_paid":
    //       return "not_paid"
    //     case "pending":
    //       return "not_paid"
    //     case "authorized":
    //       return "awaiting"
    //     case "paid":
    //       return "captured"
    //     default:
    //       break
    //   }
    // }
    // normalizeProductOption(option) {
    //   return {
    //     title: option.name,
    //     values: option.values.map((v) => {
    //       return { value: v }
    //     }),
    //   }
    // }
    // normalizePrices(presentmentPrices) {
    //   return presentmentPrices.map((p) => {
    //     return {
    //       amount: parsePrice(p.price.amount),
    //       currency_code: p.price.currency_code.toLowerCase(),
    //     }
    //   })
    // }
    // normalizeVariantOptions(option1, option2, option3) {
    //   let opts = []
    //   if (option1) {
    //     opts.push({
    //       value: option1,
    //     })
    //   }
    //   if (option2) {
    //     opts.push({
    //       value: option2,
    //     })
    //   }
    //   if (option3) {
    //     opts.push({
    //       value: option3,
    //     })
    //   }
    //   return opts
    // }
    // normalizeTag(tag) {
    //   return {
    //     value: tag,
    //   }
    // }
    // normalizeVariant(variant) {
    //   return {
    //     title: variant.title,
    //     prices: this.normalizePrices(variant.presentment_prices),
    //     sku: variant.sku || null,
    //     barcode: variant.barcode || null,
    //     upc: variant.barcode || null,
    //     inventory_quantity: variant.inventory_quantity,
    //     variant_rank: variant.position,
    //     allow_backorder: variant.inventory_policy === "continue",
    //     manage_inventory: variant.inventory_management === "shopify", //if customer previously managed inventory through Shopify then true
    //     weight: variant.grams,
    //     options: this.normalizeVariantOptions(
    //       variant.option1,
    //       variant.option2,
    //       variant.option3
    //     ),
    //   }
    // }
    // normalizeProduct(product, collectionId) {
    //   return {
    //     title: product.title,
    //     handle: product.handle,
    //     description: product.body_html,
    //     product_type: {
    //       value: product.product_type,
    //     },
    //     is_giftcard: product.product_type === "Gift Cards",
    //     options:
    //       product.options.map((option) => this.normalizeProductOption(option)) ||
    //       [],
    //     variants:
    //       product.variants.map((variant) => this.normalizeVariant(variant)) || [],
    //     tags: product.tags.split(",").map((tag) => this.normalizeTag(tag)) || [],
    //     images: product.images.map((img) => img.src) || [],
    //     thumbnail: product.image?.src || null,
    //     collection_id: collectionId || null,
    //     external_id: product.id,
    //     status: "proposed", //products from Shopify should always be of status "proposed"
    //   }
    // }
    // normalizeCollection(shopifyCollection) {
    //   return {
    //     title: shopifyCollection.title,
    //     handle: shopifyCollection.handle,
    //     metadata: {
    //       sh_id: shopifyCollection.id,
    //       sh_body: shopifyCollection.body_html,
    //     },
    //   }
    // }
    // normalizeAddress(shopifyAddress) {
    //   return {
    //     first_name: shopifyAddress.first_name,
    //     last_name: shopifyAddress.last_name,
    //     phone: shopifyAddress.phone,
    //     company: shopifyAddress.company,
    //     address_1: shopifyAddress.address1,
    //     address_2: shopifyAddress.address2,
    //     city: shopifyAddress.city,
    //     postal_code: shopifyAddress.zip,
    //     country_code: shopifyAddress.country_code.toLowerCase(),
    //     province: shopifyAddress.province_code,
    //   }
    // }
    // normalizeCustomer(shopifyCustomer, shippingAddress, billingAddress) {
    //   return {
    //     first_name: shopifyCustomer.first_name,
    //     last_name: shopifyCustomer.last_name,
    //     email: shopifyCustomer.email,
    //     phone: shopifyCustomer.phone,
    //     shipping_address: this.normalizeAddress(shippingAddress),
    //     billing_address: this.normalizeAddress(billingAddress),
    //     metadata: {
    //       sh_id: shopifyCustomer.id,
    //     },
    //   }
    // }

  }]);

  return ShopifyService;
}(_medusaInterfaces.BaseService);

var _default = ShopifyService;
exports["default"] = _default;
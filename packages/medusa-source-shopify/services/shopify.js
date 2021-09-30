"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _medusaCoreUtils = require("medusa-core-utils");

var _medusaInterfaces = require("medusa-interfaces");

var _parsePrice = require("../utils/parse-price");

var _removeIndex = require("../utils/remove-index");

var _lodash = _interopRequireDefault(require("lodash"));

var _createClient = require("../utils/create-client");

var _pager = require("../utils/pager");

var _const = require("../const");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

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
        productService = _ref.productService,
        productVariantService = _ref.productVariantService,
        productCollectionService = _ref.productCollectionService,
        shippingProfileService = _ref.shippingProfileService,
        customerService = _ref.customerService,
        orderService = _ref.orderService,
        regionService = _ref.regionService,
        paymentRepository = _ref.paymentRepository;

    _classCallCheck(this, ShopifyService);

    _this = _super.call(this);
    _this.options = options;
    /** @private @const {EntityManager} */

    _this.manager_ = manager;
    /** @private @const {ProductService} */

    _this.productService_ = productService;
    /** @private @const {ProductVariantService} */

    _this.productVariantService_ = productVariantService;
    /** @private @const {ProductCollectionService} */

    _this.collectionService_ = productCollectionService;
    /** @private @const {ShippingProfileService} */

    _this.shippingProfileService_ = shippingProfileService;
    /** @private @const {CustomerService} */

    _this.customerService_ = customerService;
    /** @private @const {OrderService} */

    _this.orderService_ = orderService;
    /** @private @const {RegionService} */

    _this.regionService_ = regionService;
    /** @private @const {PaymentRepository} */

    _this.paymentRepository_ = paymentRepository;
    /** @private @const {ShopifyRestClient} */

    _this.client_ = (0, _createClient.createClient)(options);
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
        orderService: this.orderService_,
        customerService: this.customerService_,
        productCollectionService: this.collectionService_,
        shippingProfileService: this.shippingProfileService_,
        productVariantRepository: this.productVariantRepository_,
        productService: this.productService_,
        regionService: this.regionService_,
        paymentRepository: this.paymentRepository_
      });
      cloned.transactionManager_ = transactionManager;
      return cloned;
    }
  }, {
    key: "importShopify",
    value: function () {
      var _importShopify = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(manager) {
                    var products, customCollections, smartCollections, collects, normalizedCustomCollections, normalizedSmartCollections;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.next = 2;
                            return _this2.shippingProfileService_.createDefault();

                          case 2:
                            _context2.next = 4;
                            return _this2.shippingProfileService_.createGiftCardDefault();

                          case 4:
                            _context2.next = 6;
                            return (0, _pager.pager)(_this2.client_, "products", _const.INCLUDE_PRESENTMENT_PRICES);

                          case 6:
                            products = _context2.sent;
                            _context2.next = 9;
                            return (0, _pager.pager)(_this2.client_, "custom_collections");

                          case 9:
                            customCollections = _context2.sent;
                            _context2.next = 12;
                            return (0, _pager.pager)(_this2.client_, "smart_collections");

                          case 12:
                            smartCollections = _context2.sent;
                            _context2.next = 15;
                            return (0, _pager.pager)(_this2.client_, "collects");

                          case 15:
                            collects = _context2.sent;
                            normalizedCustomCollections = customCollections.map(function (cc) {
                              return _this2.normalizeCollection(cc);
                            });
                            normalizedSmartCollections = smartCollections.map(function (sc) {
                              return _this2.normalizeCollection(sc);
                            });
                            _context2.next = 20;
                            return _this2.createCollectionsWithProducts(collects, normalizedCustomCollections, products);

                          case 20:
                            _context2.next = 22;
                            return _this2.createCollectionsWithProducts(collects, normalizedSmartCollections, products);

                          case 22:
                            _context2.next = 24;
                            return Promise.all(products.map( /*#__PURE__*/function () {
                              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(p) {
                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                  while (1) {
                                    switch (_context.prev = _context.next) {
                                      case 0:
                                        _context.prev = 0;
                                        _context.next = 3;
                                        return _this2.createProduct(p);

                                      case 3:
                                        _context.next = 8;
                                        break;

                                      case 5:
                                        _context.prev = 5;
                                        _context.t0 = _context["catch"](0);
                                        console.log("".concat(p.title, " already exists"));

                                      case 8:
                                      case "end":
                                        return _context.stop();
                                    }
                                  }
                                }, _callee, null, [[0, 5]]);
                              }));

                              return function (_x2) {
                                return _ref3.apply(this, arguments);
                              };
                            }()));

                          case 24:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));

                  return function (_x) {
                    return _ref2.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function importShopify() {
        return _importShopify.apply(this, arguments);
      }

      return importShopify;
    }()
  }, {
    key: "createCollectionsWithProducts",
    value: function () {
      var _createCollectionsWithProducts = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(collects, normalizedCollections, products) {
        var _this3 = this;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(manager) {
                    return regeneratorRuntime.wrap(function _callee6$(_context6) {
                      while (1) {
                        switch (_context6.prev = _context6.next) {
                          case 0:
                            return _context6.abrupt("return", Promise.all(normalizedCollections.map( /*#__PURE__*/function () {
                              var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(nc) {
                                var collection, productIds, reducedProducts;
                                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                  while (1) {
                                    switch (_context5.prev = _context5.next) {
                                      case 0:
                                        _context5.next = 2;
                                        return _this3.collectionService_.retrieveByHandle(nc.handle)["catch"](function (_) {
                                          return undefined;
                                        });

                                      case 2:
                                        collection = _context5.sent;

                                        if (collection) {
                                          _context5.next = 7;
                                          break;
                                        }

                                        _context5.next = 6;
                                        return _this3.collectionService_.withTransaction(manager).create(nc);

                                      case 6:
                                        collection = _context5.sent;

                                      case 7:
                                        productIds = collects.reduce(function (productIds, c) {
                                          if (c.collection_id === collection.metadata.sh_id) {
                                            productIds.push(c.product_id);
                                          }

                                          return productIds;
                                        }, []);
                                        reducedProducts = products.reduce(function (reducedProducts, p) {
                                          if (productIds.includes(p.id)) {
                                            reducedProducts.push(p);
                                            /**
                                             * As we only support products belonging to one collection,
                                             * we need to remove the product from the list of products
                                             * to prevent trying to add a product to several collections.
                                             * This is done on a first-come basis, so once a product belongs
                                             * to a collection, it is then removed from the list of products
                                             * that still needs to be imported.
                                             */

                                            /**
                                             * As we only support products belonging to one collection,
                                             * we need to remove the product from the list of products
                                             * to prevent trying to add a product to several collections.
                                             * This is done on a first-come basis, so once a product belongs
                                             * to a collection, it is then removed from the list of products
                                             * that still needs to be imported.
                                             */
                                            (0, _removeIndex.removeIndex)(products, p);
                                          }

                                          return reducedProducts;
                                        }, []);
                                        return _context5.abrupt("return", Promise.all(reducedProducts.map( /*#__PURE__*/function () {
                                          var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(rp) {
                                            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                              while (1) {
                                                switch (_context4.prev = _context4.next) {
                                                  case 0:
                                                    _context4.prev = 0;
                                                    _context4.next = 3;
                                                    return _this3.createProduct(rp, collection.id);

                                                  case 3:
                                                    _context4.next = 8;
                                                    break;

                                                  case 5:
                                                    _context4.prev = 5;
                                                    _context4.t0 = _context4["catch"](0);
                                                    console.log("".concat(rp.title, " already exists"));

                                                  case 8:
                                                  case "end":
                                                    return _context4.stop();
                                                }
                                              }
                                            }, _callee4, null, [[0, 5]]);
                                          }));

                                          return function (_x8) {
                                            return _ref6.apply(this, arguments);
                                          };
                                        }())));

                                      case 10:
                                      case "end":
                                        return _context5.stop();
                                    }
                                  }
                                }, _callee5);
                              }));

                              return function (_x7) {
                                return _ref5.apply(this, arguments);
                              };
                            }())));

                          case 1:
                          case "end":
                            return _context6.stop();
                        }
                      }
                    }, _callee6);
                  }));

                  return function (_x6) {
                    return _ref4.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function createCollectionsWithProducts(_x3, _x4, _x5) {
        return _createCollectionsWithProducts.apply(this, arguments);
      }

      return createCollectionsWithProducts;
    }()
  }, {
    key: "createProduct",
    value: function () {
      var _createProduct = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(productOrId, collectionId) {
        var _this4 = this;

        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(manager) {
                    var product, shippingProfile, normalizedProduct, variants, newProd;
                    return regeneratorRuntime.wrap(function _callee9$(_context9) {
                      while (1) {
                        switch (_context9.prev = _context9.next) {
                          case 0:
                            if (!(typeof productOrId === "number")) {
                              _context9.next = 6;
                              break;
                            }

                            _context9.next = 3;
                            return _this4.client_.get({
                              path: "products/".concat(productOrId),
                              extraHeaders: _const.INCLUDE_PRESENTMENT_PRICES
                            });

                          case 3:
                            product = _context9.sent;
                            _context9.next = 7;
                            break;

                          case 6:
                            product = productOrId;

                          case 7:
                            normalizedProduct = _this4.normalizeProduct(product, collectionId); // Get default shipping profile

                            if (!normalizedProduct.is_giftcard) {
                              _context9.next = 14;
                              break;
                            }

                            _context9.next = 11;
                            return _this4.shippingProfileService_.retrieveGiftCardDefault();

                          case 11:
                            shippingProfile = _context9.sent;
                            _context9.next = 17;
                            break;

                          case 14:
                            _context9.next = 16;
                            return _this4.shippingProfileService_.retrieveDefault();

                          case 16:
                            shippingProfile = _context9.sent;

                          case 17:
                            variants = normalizedProduct.variants;
                            delete normalizedProduct.variants;
                            normalizedProduct.profile_id = shippingProfile;
                            _context9.next = 22;
                            return _this4.productService_.withTransaction(manager).create(normalizedProduct);

                          case 22:
                            newProd = _context9.sent;

                            if (!(variants && variants.length)) {
                              _context9.next = 25;
                              break;
                            }

                            return _context9.delegateYield( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
                              var optionIds, _iterator, _step, v, variant;

                              return regeneratorRuntime.wrap(function _callee8$(_context8) {
                                while (1) {
                                  switch (_context8.prev = _context8.next) {
                                    case 0:
                                      optionIds = normalizedProduct.options.map(function (o) {
                                        return newProd.options.find(function (newO) {
                                          return newO.title === o.title;
                                        }).id;
                                      });
                                      _iterator = _createForOfIteratorHelper(variants);
                                      _context8.prev = 2;

                                      _iterator.s();

                                    case 4:
                                      if ((_step = _iterator.n()).done) {
                                        _context8.next = 11;
                                        break;
                                      }

                                      v = _step.value;
                                      variant = _objectSpread(_objectSpread({}, v), {}, {
                                        options: v.options.map(function (o, index) {
                                          return _objectSpread(_objectSpread({}, o), {}, {
                                            option_id: optionIds[index]
                                          });
                                        })
                                      });
                                      _context8.next = 9;
                                      return _this4.productVariantService_.withTransaction(manager).create(newProd.id, variant);

                                    case 9:
                                      _context8.next = 4;
                                      break;

                                    case 11:
                                      _context8.next = 16;
                                      break;

                                    case 13:
                                      _context8.prev = 13;
                                      _context8.t0 = _context8["catch"](2);

                                      _iterator.e(_context8.t0);

                                    case 16:
                                      _context8.prev = 16;

                                      _iterator.f();

                                      return _context8.finish(16);

                                    case 19:
                                    case "end":
                                      return _context8.stop();
                                  }
                                }
                              }, _callee8, null, [[2, 13, 16, 19]]);
                            })(), "t0", 25);

                          case 25:
                          case "end":
                            return _context9.stop();
                        }
                      }
                    }, _callee9);
                  }));

                  return function (_x11) {
                    return _ref7.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function createProduct(_x9, _x10) {
        return _createProduct.apply(this, arguments);
      }

      return createProduct;
    }()
  }, {
    key: "createCustomer",
    value: function () {
      var _createCustomer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(customer, shippingAddress, billingAddress) {
        var _this5 = this;

        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                return _context12.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(manager) {
                    var existingCustomer, normalizedCustomer, normalizedBilling, normalizedShipping, medusaCustomer, result;
                    return regeneratorRuntime.wrap(function _callee11$(_context11) {
                      while (1) {
                        switch (_context11.prev = _context11.next) {
                          case 0:
                            _context11.next = 2;
                            return _this5.customerService_.retrieveByEmail(customer.email)["catch"](function (_err) {
                              return undefined;
                            });

                          case 2:
                            existingCustomer = _context11.sent;

                            if (!existingCustomer) {
                              _context11.next = 5;
                              break;
                            }

                            return _context11.abrupt("return", existingCustomer);

                          case 5:
                            normalizedCustomer = _this5.normalizeCustomer(customer, shippingAddress, billingAddress);
                            normalizedBilling = normalizedCustomer.billing_address;
                            normalizedShipping = normalizedCustomer.shipping_address;
                            delete normalizedCustomer.billing_address;
                            delete normalizedCustomer.shipping_address;
                            _context11.next = 12;
                            return _this5.customerService_.withTransaction(manager).create(normalizedCustomer);

                          case 12:
                            medusaCustomer = _context11.sent;
                            _context11.next = 15;
                            return _this5.customerService_.withTransaction(manager).addAddress(medusaCustomer.id, normalizedShipping)["catch"](function (e) {
                              return console.log("Failed on creating shipping address", e, normalizedShipping);
                            });

                          case 15:
                            _context11.next = 17;
                            return _this5.customerService_.withTransaction(manager).update(medusaCustomer.id, {
                              billing_address: normalizedBilling
                            })["catch"](function (e) {
                              return console.log("Failed on creating billing address", e, normalizedBilling);
                            });

                          case 17:
                            result = _context11.sent;
                            return _context11.abrupt("return", result);

                          case 19:
                          case "end":
                            return _context11.stop();
                        }
                      }
                    }, _callee11);
                  }));

                  return function (_x15) {
                    return _ref8.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function createCustomer(_x12, _x13, _x14) {
        return _createCustomer.apply(this, arguments);
      }

      return createCustomer;
    }()
  }, {
    key: "addShippingMethod",
    value: function () {
      var _addShippingMethod = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(shippingLine, orderId, taxRate) {
        var _this6 = this;

        var soId;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                soId = "so_01FGVE1EPJM1SFRP29YJCK353K"; //temp

                return _context14.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(manager) {
                    var order;
                    return regeneratorRuntime.wrap(function _callee13$(_context13) {
                      while (1) {
                        switch (_context13.prev = _context13.next) {
                          case 0:
                            _context13.next = 2;
                            return _this6.orderService_.withTransaction(manager).addShippingMethod(orderId, soId, {}, {
                              price: (0, _parsePrice.parsePrice)(shippingLine.price) * (1 - taxRate)
                            });

                          case 2:
                            order = _context13.sent;
                            return _context13.abrupt("return", order);

                          case 4:
                          case "end":
                            return _context13.stop();
                        }
                      }
                    }, _callee13);
                  }));

                  return function (_x19) {
                    return _ref9.apply(this, arguments);
                  };
                }()));

              case 2:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function addShippingMethod(_x16, _x17, _x18) {
        return _addShippingMethod.apply(this, arguments);
      }

      return addShippingMethod;
    }()
  }, {
    key: "createOrder",
    value: function () {
      var _createOrder = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(order) {
        var _this7 = this;

        return regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                return _context17.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(manager) {
                    var customer, shipping_address, billing_address, tax_lines, medCustomer, region, orderTaxRate, normalizedOrder, medusaOrder;
                    return regeneratorRuntime.wrap(function _callee16$(_context16) {
                      while (1) {
                        switch (_context16.prev = _context16.next) {
                          case 0:
                            customer = order.customer, shipping_address = order.shipping_address, billing_address = order.billing_address, tax_lines = order.tax_lines;
                            _context16.next = 3;
                            return _this7.createCustomer(customer, shipping_address, billing_address);

                          case 3:
                            medCustomer = _context16.sent;

                            if (medCustomer) {
                              _context16.next = 6;
                              break;
                            }

                            throw new _medusaCoreUtils.MedusaError(_medusaCoreUtils.MedusaError.Types.NOT_FOUND, "An error occured while attempting to create or retrieve a customer");

                          case 6:
                            _context16.next = 8;
                            return _this7.regionService_.retrieveByCountryCode(shipping_address.country_code.toLowerCase());

                          case 8:
                            region = _context16.sent;
                            orderTaxRate = tax_lines[0].rate || 0;
                            _context16.next = 12;
                            return _this7.normalizeOrder(order, medCustomer.id, region.id, region.tax_rate, orderTaxRate);

                          case 12:
                            normalizedOrder = _context16.sent;

                            if (normalizedOrder) {
                              _context16.next = 15;
                              break;
                            }

                            throw new _medusaCoreUtils.MedusaError(_medusaCoreUtils.MedusaError.Types.INVALID_DATA, "An error occurred while normalizing the order");

                          case 15:
                            _context16.next = 17;
                            return _this7.orderService_.withTransaction(manager).create(normalizedOrder);

                          case 17:
                            medusaOrder = _context16.sent;
                            _context16.next = 20;
                            return Promise.all(order.shipping_lines.map( /*#__PURE__*/function () {
                              var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(sl) {
                                return regeneratorRuntime.wrap(function _callee15$(_context15) {
                                  while (1) {
                                    switch (_context15.prev = _context15.next) {
                                      case 0:
                                        return _context15.abrupt("return", _this7.addShippingMethod(sl, medusaOrder.id, orderTaxRate));

                                      case 1:
                                      case "end":
                                        return _context15.stop();
                                    }
                                  }
                                }, _callee15);
                              }));

                              return function (_x22) {
                                return _ref11.apply(this, arguments);
                              };
                            }()));

                          case 20:
                            _context16.next = 22;
                            return _this7.createPayment({
                              order_id: medusaOrder.id,
                              currency_code: medusaOrder.currency_code,
                              total: _this7.getOrderTotal(order)
                            });

                          case 22:
                          case "end":
                            return _context16.stop();
                        }
                      }
                    }, _callee16);
                  }));

                  return function (_x21) {
                    return _ref10.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function createOrder(_x20) {
        return _createOrder.apply(this, arguments);
      }

      return createOrder;
    }()
  }, {
    key: "cancelOrder",
    value: function () {
      var _cancelOrder = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(orderId) {
        var _this8 = this;

        return regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                return _context19.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(manager) {
                    var order;
                    return regeneratorRuntime.wrap(function _callee18$(_context18) {
                      while (1) {
                        switch (_context18.prev = _context18.next) {
                          case 0:
                            order = _this8.orderService_.retrieveByExternalId(orderId);
                            _context18.next = 3;
                            return _this8.orderService_.withTransaction(manager).cancel(order.id);

                          case 3:
                            return _context18.abrupt("return", _context18.sent);

                          case 4:
                          case "end":
                            return _context18.stop();
                        }
                      }
                    }, _callee18);
                  }));

                  return function (_x24) {
                    return _ref12.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function cancelOrder(_x23) {
        return _cancelOrder.apply(this, arguments);
      }

      return cancelOrder;
    }()
  }, {
    key: "createPayment",
    value: function () {
      var _createPayment = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(data) {
        var _this9 = this;

        return regeneratorRuntime.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                return _context21.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(manager) {
                    var paymentRepo, created;
                    return regeneratorRuntime.wrap(function _callee20$(_context20) {
                      while (1) {
                        switch (_context20.prev = _context20.next) {
                          case 0:
                            paymentRepo = manager.getCustomRepository(_this9.paymentRepository_);
                            created = paymentRepo.create({
                              provider_id: "shopify",
                              amount: data.total,
                              currency_code: data.currency_code,
                              data: {},
                              order_id: data.order_id
                            });
                            return _context20.abrupt("return", paymentRepo.save(created));

                          case 3:
                          case "end":
                            return _context20.stop();
                        }
                      }
                    }, _callee20);
                  }));

                  return function (_x26) {
                    return _ref13.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      function createPayment(_x25) {
        return _createPayment.apply(this, arguments);
      }

      return createPayment;
    }()
  }, {
    key: "updateProduct",
    value: function () {
      var _updateProduct = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24(product) {
        var _this10 = this;

        return regeneratorRuntime.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                return _context24.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23(manager) {
                    var medusaProduct, _yield$_this10$client, variants, normalizedUpdate, updates;

                    return regeneratorRuntime.wrap(function _callee23$(_context23) {
                      while (1) {
                        switch (_context23.prev = _context23.next) {
                          case 0:
                            _context23.next = 2;
                            return _this10.productService_.retrieveByHandle(product.handle, {
                              relations: ["variants"]
                            })["catch"](function (_) {
                              return undefined;
                            });

                          case 2:
                            medusaProduct = _context23.sent;

                            if (medusaProduct) {
                              _context23.next = 6;
                              break;
                            }

                            console.log("No product found");
                            return _context23.abrupt("return", Promise.resolve());

                          case 6:
                            _context23.next = 8;
                            return _this10.client_.get({
                              path: "products/".concat(product.id),
                              extraHeaders: _const.INCLUDE_PRESENTMENT_PRICES
                            }).then(function (res) {
                              return res.body.product;
                            });

                          case 8:
                            _yield$_this10$client = _context23.sent;
                            variants = _yield$_this10$client.variants;
                            product.variants = variants || [];
                            normalizedUpdate = _this10.normalizeProduct(product);
                            updates = _lodash["default"].pickBy(normalizedUpdate, Boolean);
                            _context23.next = 15;
                            return Promise.all(updates.variants.map( /*#__PURE__*/function () {
                              var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22(v) {
                                var match, variant, options;
                                return regeneratorRuntime.wrap(function _callee22$(_context22) {
                                  while (1) {
                                    switch (_context22.prev = _context22.next) {
                                      case 0:
                                        match = medusaProduct.variants.find(function (mv) {
                                          return mv.sku === v.sku;
                                        });

                                        if (!match) {
                                          _context22.next = 8;
                                          break;
                                        }

                                        _context22.next = 4;
                                        return _this10.productVariantService_.withTransaction(manager).retrieve(match.id, {
                                          relations: ["options"]
                                        });

                                      case 4:
                                        variant = _context22.sent;
                                        options = variant.options.map(function (o, i) {
                                          return _objectSpread(_objectSpread({}, o), v.options[i]);
                                        });
                                        v.options = options;
                                        v.id = variant.id;

                                      case 8:
                                        return _context22.abrupt("return", v);

                                      case 9:
                                      case "end":
                                        return _context22.stop();
                                    }
                                  }
                                }, _callee22);
                              }));

                              return function (_x29) {
                                return _ref15.apply(this, arguments);
                              };
                            }()));

                          case 15:
                            updates.variants = _context23.sent;
                            _context23.next = 18;
                            return _this10.productService_.withTransaction(manager).update(medusaProduct.id, updates);

                          case 18:
                            return _context23.abrupt("return", Promise.resolve());

                          case 19:
                          case "end":
                            return _context23.stop();
                        }
                      }
                    }, _callee23);
                  }));

                  return function (_x28) {
                    return _ref14.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this);
      }));

      function updateProduct(_x27) {
        return _updateProduct.apply(this, arguments);
      }

      return updateProduct;
    }()
  }, {
    key: "deleteProduct",
    value: function () {
      var _deleteProduct = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26(id) {
        var _this11 = this;

        return regeneratorRuntime.wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                return _context26.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25(manager) {
                    var product;
                    return regeneratorRuntime.wrap(function _callee25$(_context25) {
                      while (1) {
                        switch (_context25.prev = _context25.next) {
                          case 0:
                            _context25.next = 2;
                            return _this11.productService_.retrieveByExternalId(id)["catch"](function (_) {
                              return undefined;
                            });

                          case 2:
                            product = _context25.sent;

                            if (!product) {
                              _context25.next = 6;
                              break;
                            }

                            _context25.next = 6;
                            return _this11.productService_.withTransaction(manager)["delete"](product.id);

                          case 6:
                          case "end":
                            return _context25.stop();
                        }
                      }
                    }, _callee25);
                  }));

                  return function (_x31) {
                    return _ref16.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26, this);
      }));

      function deleteProduct(_x30) {
        return _deleteProduct.apply(this, arguments);
      }

      return deleteProduct;
    }()
  }, {
    key: "normalizeOrder",
    value: function () {
      var _normalizeOrder = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee29(shopifyOrder, customerId, regionId, taxRate, shopifyTaxRate) {
        var _this12 = this;

        return regeneratorRuntime.wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                return _context29.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28(manager) {
                    return regeneratorRuntime.wrap(function _callee28$(_context28) {
                      while (1) {
                        switch (_context28.prev = _context28.next) {
                          case 0:
                            _context28.t0 = _this12.normalizeOrderStatus();
                            _context28.t1 = regionId;
                            _context28.t2 = shopifyOrder.email;
                            _context28.t3 = customerId;
                            _context28.t4 = shopifyOrder.currency.toLowerCase();
                            _context28.t5 = taxRate;
                            _context28.t6 = (0, _parsePrice.parsePrice)(shopifyOrder.total_tax);
                            _context28.t7 = shopifyOrder.subtotal_price;
                            _context28.t8 = _this12.normalizeAddress(shopifyOrder.shipping_address);
                            _context28.t9 = _this12.normalizeAddress(shopifyOrder.billing_address);
                            _context28.t10 = shopifyOrder.total_discounts;
                            _context28.t11 = _this12.normalizeOrderFulfilmentStatus(shopifyOrder.fulfilment_status);
                            _context28.t12 = _this12.normalizeOrderPaymentStatus(shopifyOrder.financial_status);
                            _context28.next = 15;
                            return Promise.all(shopifyOrder.line_items.map( /*#__PURE__*/function () {
                              var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27(i) {
                                return regeneratorRuntime.wrap(function _callee27$(_context27) {
                                  while (1) {
                                    switch (_context27.prev = _context27.next) {
                                      case 0:
                                        return _context27.abrupt("return", _this12.normalizeLineItem(i, shopifyTaxRate));

                                      case 1:
                                      case "end":
                                        return _context27.stop();
                                    }
                                  }
                                }, _callee27);
                              }));

                              return function (_x38) {
                                return _ref18.apply(this, arguments);
                              };
                            }()));

                          case 15:
                            _context28.t13 = _context28.sent;
                            _context28.t14 = shopifyOrder.id;
                            return _context28.abrupt("return", {
                              status: _context28.t0,
                              region_id: _context28.t1,
                              email: _context28.t2,
                              customer_id: _context28.t3,
                              currency_code: _context28.t4,
                              tax_rate: _context28.t5,
                              tax_total: _context28.t6,
                              subtotal: _context28.t7,
                              shipping_address: _context28.t8,
                              billing_address: _context28.t9,
                              discount_total: _context28.t10,
                              fulfilment_status: _context28.t11,
                              payment_status: _context28.t12,
                              items: _context28.t13,
                              external_id: _context28.t14
                            });

                          case 18:
                          case "end":
                            return _context28.stop();
                        }
                      }
                    }, _callee28);
                  }));

                  return function (_x37) {
                    return _ref17.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context29.stop();
            }
          }
        }, _callee29, this);
      }));

      function normalizeOrder(_x32, _x33, _x34, _x35, _x36) {
        return _normalizeOrder.apply(this, arguments);
      }

      return normalizeOrder;
    }()
  }, {
    key: "getOrderTotal",
    value: function getOrderTotal(order) {
      var shippingTotal = order.shipping_lines.reduce(function (total, i) {
        return (0, _parsePrice.parsePrice)(i.price) + total;
      }, 0);
      var itemTotal = order.line_items.reduce(function (total, i) {
        return (0, _parsePrice.parsePrice)(i.price) + total;
      }, 0);
      return shippingTotal + itemTotal;
    }
  }, {
    key: "normalizeLineItem",
    value: function () {
      var _normalizeLineItem = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee31(lineItem, taxRate) {
        var _this13 = this;

        return regeneratorRuntime.wrap(function _callee31$(_context31) {
          while (1) {
            switch (_context31.prev = _context31.next) {
              case 0:
                return _context31.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee30(manager) {
                    var productVariant;
                    return regeneratorRuntime.wrap(function _callee30$(_context30) {
                      while (1) {
                        switch (_context30.prev = _context30.next) {
                          case 0:
                            _context30.next = 2;
                            return _this13.productVariantService_.withTransaction(manager).retrieveBySKU(lineItem.sku);

                          case 2:
                            productVariant = _context30.sent;
                            return _context30.abrupt("return", {
                              title: lineItem.title,
                              is_giftcard: lineItem.gift_card,
                              unit_price: (0, _parsePrice.parsePrice)(lineItem.price) * (1 - taxRate),
                              quantity: lineItem.quantity,
                              fulfilled_quantity: lineItem.fulfillment_status === "fulfilled" ? lineItem.fulfillable_quantity : 0,
                              variant_id: productVariant.id
                            });

                          case 4:
                          case "end":
                            return _context30.stop();
                        }
                      }
                    }, _callee30);
                  }));

                  return function (_x41) {
                    return _ref19.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context31.stop();
            }
          }
        }, _callee31, this);
      }));

      function normalizeLineItem(_x39, _x40) {
        return _normalizeLineItem.apply(this, arguments);
      }

      return normalizeLineItem;
    }()
  }, {
    key: "normalizeOrderStatus",
    value: function normalizeOrderStatus() {
      return "completed";
    }
  }, {
    key: "normalizeOrderFulfilmentStatus",
    value: function normalizeOrderFulfilmentStatus(fulfilmentStatus) {
      switch (fulfilmentStatus) {
        case null:
          return "not_fulfilled";

        case "fulfilled":
          return "fulfilled";

        case "partial":
          return "partially_fulfilled";

        case "restocked":
          return "returned";

        case "pending":
          return "not_fulfilled";

        default:
          break;
      }
    }
  }, {
    key: "normalizeOrderPaymentStatus",
    value: function normalizeOrderPaymentStatus(financial_status) {
      switch (financial_status) {
        case "refunded":
          return "refunded";

        case "voided":
          return "canceled";

        case "partially_refunded":
          return "partially_refunded";

        case "partially_paid":
          return "not_paid";

        case "pending":
          return "not_paid";

        case "authorized":
          return "awaiting";

        case "paid":
          return "captured";

        default:
          break;
      }
    }
  }, {
    key: "normalizeProductOption",
    value: function normalizeProductOption(option) {
      return {
        title: option.name,
        values: option.values.map(function (v) {
          return {
            value: v
          };
        })
      };
    }
  }, {
    key: "normalizePrices",
    value: function normalizePrices(presentmentPrices) {
      return presentmentPrices.map(function (p) {
        return {
          amount: (0, _parsePrice.parsePrice)(p.price.amount),
          currency_code: p.price.currency_code.toLowerCase()
        };
      });
    }
  }, {
    key: "normalizeVariantOptions",
    value: function normalizeVariantOptions(option1, option2, option3) {
      var opts = [];

      if (option1) {
        opts.push({
          value: option1
        });
      }

      if (option2) {
        opts.push({
          value: option2
        });
      }

      if (option3) {
        opts.push({
          value: option3
        });
      }

      return opts;
    }
  }, {
    key: "normalizeTag",
    value: function normalizeTag(tag) {
      return {
        value: tag
      };
    }
  }, {
    key: "normalizeVariant",
    value: function normalizeVariant(variant) {
      return {
        title: variant.title,
        prices: this.normalizePrices(variant.presentment_prices),
        sku: variant.sku || null,
        barcode: variant.barcode || null,
        upc: variant.barcode || null,
        inventory_quantity: variant.inventory_quantity,
        variant_rank: variant.position,
        allow_backorder: variant.inventory_policy === "continue",
        manage_inventory: variant.inventory_management === "shopify",
        //if customer previously managed inventory through Shopify then true
        weight: variant.grams,
        options: this.normalizeVariantOptions(variant.option1, variant.option2, variant.option3)
      };
    }
  }, {
    key: "normalizeProduct",
    value: function normalizeProduct(product, collectionId) {
      var _this14 = this,
          _product$image;

      return {
        title: product.title,
        handle: product.handle,
        description: product.body_html,
        product_type: {
          value: product.product_type
        },
        is_giftcard: product.product_type === "Gift Cards",
        options: product.options.map(function (option) {
          return _this14.normalizeProductOption(option);
        }) || [],
        variants: product.variants.map(function (variant) {
          return _this14.normalizeVariant(variant);
        }) || [],
        tags: product.tags.split(",").map(function (tag) {
          return _this14.normalizeTag(tag);
        }) || [],
        images: product.images.map(function (img) {
          return img.src;
        }) || [],
        thumbnail: ((_product$image = product.image) === null || _product$image === void 0 ? void 0 : _product$image.src) || null,
        collection_id: collectionId || null,
        external_id: product.id,
        status: "proposed" //products from Shopify should always be of status "proposed"

      };
    }
  }, {
    key: "normalizeCollection",
    value: function normalizeCollection(shopifyCollection) {
      return {
        title: shopifyCollection.title,
        handle: shopifyCollection.handle,
        metadata: {
          sh_id: shopifyCollection.id,
          sh_body: shopifyCollection.body_html
        }
      };
    }
  }, {
    key: "normalizeAddress",
    value: function normalizeAddress(shopifyAddress) {
      return {
        first_name: shopifyAddress.first_name,
        last_name: shopifyAddress.last_name,
        phone: shopifyAddress.phone,
        company: shopifyAddress.company,
        address_1: shopifyAddress.address1,
        address_2: shopifyAddress.address2,
        city: shopifyAddress.city,
        postal_code: shopifyAddress.zip,
        country_code: shopifyAddress.country_code.toLowerCase(),
        province: shopifyAddress.province_code
      };
    }
  }, {
    key: "normalizeCustomer",
    value: function normalizeCustomer(shopifyCustomer, shippingAddress, billingAddress) {
      return {
        first_name: shopifyCustomer.first_name,
        last_name: shopifyCustomer.last_name,
        email: shopifyCustomer.email,
        phone: shopifyCustomer.phone,
        shipping_address: this.normalizeAddress(shippingAddress),
        billing_address: this.normalizeAddress(billingAddress),
        metadata: {
          sh_id: shopifyCustomer.id
        }
      };
    }
  }]);

  return ShopifyService;
}(_medusaInterfaces.BaseService);

var _default = ShopifyService;
exports["default"] = _default;
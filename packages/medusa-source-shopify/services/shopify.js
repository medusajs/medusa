"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _medusaCoreUtils = require("medusa-core-utils");

var _medusaInterfaces = require("medusa-interfaces");

var _fetchShopify = require("../utils/fetch-shopify");

var _removeIndex = require("../utils/remove-index");

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
        regionService = _ref.regionService;

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
    return _this;
  }

  _createClass(ShopifyService, [{
    key: "importShopify",
    value: function () {
      var _importShopify = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var _this2 = this;

        var _yield$fetchShopify, products, customCollections, smartCollections, collects, normalizedCustomCollections, normalizedSmartCollections;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.shippingProfileService_.createDefault();

              case 2:
                _context3.next = 4;
                return this.shippingProfileService_.createGiftCardDefault();

              case 4:
                _context3.next = 6;
                return (0, _fetchShopify.fetchShopify)(this.options);

              case 6:
                _yield$fetchShopify = _context3.sent;
                products = _yield$fetchShopify.products;
                customCollections = _yield$fetchShopify.customCollections;
                smartCollections = _yield$fetchShopify.smartCollections;
                collects = _yield$fetchShopify.collects;
                normalizedCustomCollections = customCollections.map(function (cc) {
                  return _this2.normalizeCollection(cc);
                });
                normalizedSmartCollections = smartCollections.map(function (sc) {
                  return _this2.normalizeCollection(sc);
                });
                _context3.next = 15;
                return this.manager_.transaction( /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(m) {
                    var normalizedProducts;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.next = 2;
                            return _this2.createCollectionsWithProducts(collects, normalizedCustomCollections, products, m);

                          case 2:
                            _context2.next = 4;
                            return _this2.createCollectionsWithProducts(collects, normalizedSmartCollections, products, m);

                          case 4:
                            normalizedProducts = products.map(function (p) {
                              return _this2.normalizeProduct(p);
                            });
                            _context2.next = 7;
                            return Promise.all(normalizedProducts.map( /*#__PURE__*/function () {
                              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(p) {
                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                  while (1) {
                                    switch (_context.prev = _context.next) {
                                      case 0:
                                        _context.next = 2;
                                        return _this2.createProduct(p, m);

                                      case 2:
                                        return _context.abrupt("return", _context.sent);

                                      case 3:
                                      case "end":
                                        return _context.stop();
                                    }
                                  }
                                }, _callee);
                              }));

                              return function (_x2) {
                                return _ref3.apply(this, arguments);
                              };
                            }()));

                          case 7:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));

                  return function (_x) {
                    return _ref2.apply(this, arguments);
                  };
                }());

              case 15:
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
      var _createCollectionsWithProducts = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(collects, normalizedCollections, products, manager) {
        var _this3 = this;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", Promise.all(normalizedCollections.map( /*#__PURE__*/function () {
                  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(nc) {
                    var collection, productIds, reducedProducts, normalizedProducts;
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            _context5.next = 2;
                            return _this3.collectionService_.withTransaction(manager).create(nc);

                          case 2:
                            collection = _context5.sent;
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
                                 * to prevent trying to add a product to several collection.
                                 * This is done on a first-come basis, so once a product belongs
                                 * to a collection, it is then removed from the list of products
                                 * that still needs to be imported.
                                 */

                                /**
                                 * As we only support products belonging to one collection,
                                 * we need to remove the product from the list of products
                                 * to prevent trying to add a product to several collection.
                                 * This is done on a first-come basis, so once a product belongs
                                 * to a collection, it is then removed from the list of products
                                 * that still needs to be imported.
                                 */
                                (0, _removeIndex.removeIndex)(products, p);
                              }

                              return reducedProducts;
                            }, []);
                            normalizedProducts = reducedProducts.map(function (p) {
                              return _this3.normalizeProduct(p, collection.id);
                            });
                            return _context5.abrupt("return", Promise.all(normalizedProducts.map( /*#__PURE__*/function () {
                              var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(rp) {
                                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                  while (1) {
                                    switch (_context4.prev = _context4.next) {
                                      case 0:
                                        _context4.next = 2;
                                        return _this3.createProduct(rp, manager);

                                      case 2:
                                      case "end":
                                        return _context4.stop();
                                    }
                                  }
                                }, _callee4);
                              }));

                              return function (_x8) {
                                return _ref5.apply(this, arguments);
                              };
                            }())));

                          case 7:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5);
                  }));

                  return function (_x7) {
                    return _ref4.apply(this, arguments);
                  };
                }())));

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function createCollectionsWithProducts(_x3, _x4, _x5, _x6) {
        return _createCollectionsWithProducts.apply(this, arguments);
      }

      return createCollectionsWithProducts;
    }()
  }, {
    key: "createProduct",
    value: function () {
      var _createProduct = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(product, manager) {
        var _this4 = this;

        var shippingProfile, variants, newProd;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (!product.is_giftcard) {
                  _context8.next = 6;
                  break;
                }

                _context8.next = 3;
                return this.shippingProfileService_.retrieveGiftCardDefault();

              case 3:
                shippingProfile = _context8.sent;
                _context8.next = 9;
                break;

              case 6:
                _context8.next = 8;
                return this.shippingProfileService_.retrieveDefault();

              case 8:
                shippingProfile = _context8.sent;

              case 9:
                variants = product.variants;
                delete product.variants;
                product.profile_id = shippingProfile;
                _context8.next = 14;
                return this.productService_.withTransaction(manager).create(product);

              case 14:
                newProd = _context8.sent;

                if (!(variants && variants.length)) {
                  _context8.next = 17;
                  break;
                }

                return _context8.delegateYield( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                  var optionIds, _iterator, _step, v, variant;

                  return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                      switch (_context7.prev = _context7.next) {
                        case 0:
                          optionIds = product.options.map(function (o) {
                            return newProd.options.find(function (newO) {
                              return newO.title === o.title;
                            }).id;
                          });
                          _iterator = _createForOfIteratorHelper(variants);
                          _context7.prev = 2;

                          _iterator.s();

                        case 4:
                          if ((_step = _iterator.n()).done) {
                            _context7.next = 11;
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
                          _context7.next = 9;
                          return _this4.productVariantService_.withTransaction(manager).create(newProd.id, variant);

                        case 9:
                          _context7.next = 4;
                          break;

                        case 11:
                          _context7.next = 16;
                          break;

                        case 13:
                          _context7.prev = 13;
                          _context7.t0 = _context7["catch"](2);

                          _iterator.e(_context7.t0);

                        case 16:
                          _context7.prev = 16;

                          _iterator.f();

                          return _context7.finish(16);

                        case 19:
                        case "end":
                          return _context7.stop();
                      }
                    }
                  }, _callee7, null, [[2, 13, 16, 19]]);
                })(), "t0", 17);

              case 17:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function createProduct(_x9, _x10) {
        return _createProduct.apply(this, arguments);
      }

      return createProduct;
    }()
  }, {
    key: "createCustomer",
    value: function () {
      var _createCustomer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(customer, shippingAddress, billingAddress, manager) {
        var normalizedCustomer, normalizedBilling, normalizedShipping, existingCustomer, medCustomer, result;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                normalizedCustomer = this.normalizeCustomer(customer, shippingAddress, billingAddress);
                normalizedBilling = normalizedCustomer.billing_address;
                normalizedShipping = normalizedCustomer.shipping_address;
                _context9.next = 5;
                return this.customerService_.retrieveByEmail(normalizedCustomer.email)["catch"](function (_err) {
                  return undefined;
                });

              case 5:
                existingCustomer = _context9.sent;

                if (!existingCustomer) {
                  _context9.next = 8;
                  break;
                }

                return _context9.abrupt("return", existingCustomer);

              case 8:
                delete normalizedCustomer.billing_address;
                delete normalizedCustomer.shipping_address;
                _context9.next = 12;
                return this.customerService_.withTransaction(manager).create(normalizedCustomer);

              case 12:
                medCustomer = _context9.sent;
                _context9.next = 15;
                return this.customerService_.withTransaction(manager).addAddress(medCustomer.id, normalizedShipping)["catch"](function (err) {
                  console.log("Error on addAddress", normalizedShipping);
                });

              case 15:
                _context9.next = 17;
                return this.customerService_.withTransaction(manager).update(medCustomer.id, {
                  billing_address: normalizedBilling
                })["catch"](function (err) {
                  console.log("Error on update billing_address", normalizedBilling);
                });

              case 17:
                result = _context9.sent;
                return _context9.abrupt("return", result);

              case 19:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function createCustomer(_x11, _x12, _x13, _x14) {
        return _createCustomer.apply(this, arguments);
      }

      return createCustomer;
    }()
  }, {
    key: "addShippingMethod",
    value: function () {
      var _addShippingMethod = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(shippingLine, orderId, manager) {
        var soId, order;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                soId = "so_01FG9N9FQTC6F9NN6W1XAJFNHN"; //temp

                _context10.next = 3;
                return this.orderService_.withTransaction(manager).addShippingMethod(orderId, soId, {}, {
                  price: parseInt(Number(shippingLine.price).toFixed(2) * 100)
                });

              case 3:
                order = _context10.sent;
                return _context10.abrupt("return", order);

              case 5:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function addShippingMethod(_x15, _x16, _x17) {
        return _addShippingMethod.apply(this, arguments);
      }

      return addShippingMethod;
    }()
  }, {
    key: "createOrder",
    value: function () {
      var _createOrder = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(order) {
        var _this5 = this;

        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return this.manager_.transaction( /*#__PURE__*/function () {
                  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(m) {
                    var customer, shipping_address, billing_address, medCustomer, region, normalizedOrder, medOrder;
                    return regeneratorRuntime.wrap(function _callee12$(_context12) {
                      while (1) {
                        switch (_context12.prev = _context12.next) {
                          case 0:
                            customer = order.customer, shipping_address = order.shipping_address, billing_address = order.billing_address;
                            _context12.next = 3;
                            return _this5.createCustomer(customer, shipping_address, billing_address, m);

                          case 3:
                            medCustomer = _context12.sent;

                            if (medCustomer) {
                              _context12.next = 6;
                              break;
                            }

                            throw new _medusaCoreUtils.MedusaError(_medusaCoreUtils.MedusaError.Types.NOT_FOUND, "An error occured while attempting to create or retrieve a customer");

                          case 6:
                            _context12.next = 8;
                            return _this5.regionService_.retrieveByCountryCode(shipping_address.country_code.toLowerCase());

                          case 8:
                            region = _context12.sent;
                            _context12.next = 11;
                            return _this5.normalizeOrder(order, medCustomer.id, region.id, region.tax_rate, m);

                          case 11:
                            normalizedOrder = _context12.sent;

                            if (normalizedOrder) {
                              _context12.next = 14;
                              break;
                            }

                            throw new _medusaCoreUtils.MedusaError(_medusaCoreUtils.MedusaError.Types.INVALID_DATA, "An error occurred while normalizing the order");

                          case 14:
                            _context12.next = 16;
                            return _this5.orderService_.withTransaction(m).create(normalizedOrder)["catch"](function (err) {
                              throw new _medusaCoreUtils.MedusaError(_medusaCoreUtils.MedusaError.Types.INVALID_DATA, "An error occurred while creating an order: ".concat(err));
                            });

                          case 16:
                            medOrder = _context12.sent;
                            _context12.prev = 17;
                            _context12.next = 20;
                            return Promise.all(order.shipping_lines.map( /*#__PURE__*/function () {
                              var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(sl) {
                                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                                  while (1) {
                                    switch (_context11.prev = _context11.next) {
                                      case 0:
                                        return _context11.abrupt("return", _this5.addShippingMethod(sl, medOrder.id, m));

                                      case 1:
                                      case "end":
                                        return _context11.stop();
                                    }
                                  }
                                }, _callee11);
                              }));

                              return function (_x20) {
                                return _ref7.apply(this, arguments);
                              };
                            }()));

                          case 20:
                            _context12.next = 25;
                            break;

                          case 22:
                            _context12.prev = 22;
                            _context12.t0 = _context12["catch"](17);
                            throw new _medusaCoreUtils.MedusaError(_medusaCoreUtils.MedusaError.Types.INVALID_DATA, "An error occurred while adding shipping methods to an order: ".concat(_context12.t0));

                          case 25:
                          case "end":
                            return _context12.stop();
                        }
                      }
                    }, _callee12, null, [[17, 22]]);
                  }));

                  return function (_x19) {
                    return _ref6.apply(this, arguments);
                  };
                }());

              case 2:
                return _context13.abrupt("return", _context13.sent);

              case 3:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function createOrder(_x18) {
        return _createOrder.apply(this, arguments);
      }

      return createOrder;
    }()
  }, {
    key: "normalizeOrder",
    value: function () {
      var _normalizeOrder = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(shopifyOrder, customerId, regionId, taxRate, manager) {
        var _this6 = this;

        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.t0 = this.normalizeOrderStatus();
                _context15.t1 = regionId;
                _context15.t2 = taxRate;
                _context15.t3 = shopifyOrder.email;
                _context15.t4 = customerId;
                _context15.t5 = shopifyOrder.currency.toLowerCase();
                _context15.t6 = shopifyOrder.tax_total;
                _context15.t7 = shopifyOrder.subtotal_price;
                _context15.t8 = this.normalizeAddress(shopifyOrder.shipping_address);
                _context15.t9 = this.normalizeAddress(shopifyOrder.billing_address);
                _context15.t10 = shopifyOrder.total_discounts;
                _context15.t11 = this.normalizeOrderFulfilmentStatus(shopifyOrder.fulfilment_status);
                _context15.next = 14;
                return Promise.all(shopifyOrder.line_items.map( /*#__PURE__*/function () {
                  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(i) {
                    return regeneratorRuntime.wrap(function _callee14$(_context14) {
                      while (1) {
                        switch (_context14.prev = _context14.next) {
                          case 0:
                            return _context14.abrupt("return", _this6.normalizeLineItem(i, manager));

                          case 1:
                          case "end":
                            return _context14.stop();
                        }
                      }
                    }, _callee14);
                  }));

                  return function (_x26) {
                    return _ref8.apply(this, arguments);
                  };
                }()));

              case 14:
                _context15.t12 = _context15.sent;
                _context15.t13 = shopifyOrder.id;
                return _context15.abrupt("return", {
                  status: _context15.t0,
                  region_id: _context15.t1,
                  tax_rate: _context15.t2,
                  email: _context15.t3,
                  customer_id: _context15.t4,
                  currency_code: _context15.t5,
                  tax_total: _context15.t6,
                  subtotal: _context15.t7,
                  shipping_address: _context15.t8,
                  billing_address: _context15.t9,
                  discount_total: _context15.t10,
                  fulfilment_status: _context15.t11,
                  items: _context15.t12,
                  external_id: _context15.t13
                });

              case 17:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function normalizeOrder(_x21, _x22, _x23, _x24, _x25) {
        return _normalizeOrder.apply(this, arguments);
      }

      return normalizeOrder;
    }()
  }, {
    key: "normalizeLineItem",
    value: function () {
      var _normalizeLineItem = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(lineItem, manager) {
        var productVariant;
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.next = 2;
                return this.productVariantService_.withTransaction(manager).retrieveBySKU(lineItem.sku);

              case 2:
                productVariant = _context16.sent;
                return _context16.abrupt("return", {
                  title: lineItem.title,
                  is_giftcard: lineItem.gift_card,
                  unit_price: parseInt(parseFloat(lineItem.price).toFixed(2) * 100),
                  quantity: lineItem.quantity,
                  fulfilled_quantity: lineItem.fulfillment_status === "fulfilled" ? lineItem.fulfillable_quantity : 0,
                  variant_id: productVariant.id
                });

              case 4:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function normalizeLineItem(_x27, _x28) {
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

        case "paid":
          return "captured";

        case "partially_paid":
          return "not_paid";

        case "authorized":
          return "awaiting";

        case "pending":
          return "not_paid";

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
          amount: parseInt(parseFloat(p.price.amount).toFixed(2) * 100),
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
        weight: parseInt(variant.weight),
        options: this.normalizeVariantOptions(variant.option1, variant.option2, variant.option3)
      };
    }
  }, {
    key: "normalizeProduct",
    value: function normalizeProduct(product, collectionId) {
      var _this7 = this,
          _product$image;

      return {
        title: product.title,
        handle: product.handle,
        is_giftcard: product.product_type === "Gift Cards",
        options: product.options.map(function (option) {
          return _this7.normalizeProductOption(option);
        }) || [],
        variants: product.variants.map(function (variant) {
          return _this7.normalizeVariant(variant);
        }) || [],
        tags: product.tags.split(",").map(function (tag) {
          return _this7.normalizeTag(tag);
        }) || [],
        images: product.images.map(function (img) {
          return img.src;
        }) || [],
        thumbnail: ((_product$image = product.image) === null || _product$image === void 0 ? void 0 : _product$image.src) || null,
        collection_id: collectionId || null,
        metadata: {
          sh_id: product.id
        },
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
      var addr = {};

      try {
        addr = {
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
      } catch (_err) {
        throw new _medusaCoreUtils.MedusaError(_medusaCoreUtils.MedusaError.Types.INVALID_DATA, "An error occured while normalizing an address due to invalid data");
      }

      return addr;
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
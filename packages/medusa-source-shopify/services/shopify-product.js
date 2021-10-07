"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _medusaInterfaces = require("medusa-interfaces");

var _lodash = _interopRequireDefault(require("lodash"));

var _parsePrice = require("../utils/parse-price");

var _const = require("../utils/const");

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

var ShopifyProductService = /*#__PURE__*/function (_BaseService) {
  _inherits(ShopifyProductService, _BaseService);

  var _super = _createSuper(ShopifyProductService);

  function ShopifyProductService(_ref, options) {
    var _this;

    var manager = _ref.manager,
        productService = _ref.productService,
        productVariantService = _ref.productVariantService,
        shippingProfileService = _ref.shippingProfileService,
        shopifyClientService = _ref.shopifyClientService;

    _classCallCheck(this, ShopifyProductService);

    _this = _super.call(this);
    _this.options = options;
    /** @private @const {EntityManager} */

    _this.manager_ = manager;
    /** @private @const {ProductService} */

    _this.productService_ = productService;
    /** @private @const {ProductVariantService} */

    _this.productVariantService_ = productVariantService;
    /** @private @const {ShippingProfileService} */

    _this.shippingProfileService_ = shippingProfileService;
    /** @private @const {ShopifyRestClient} */

    _this.client_ = shopifyClientService;
    return _this;
  }

  _createClass(ShopifyProductService, [{
    key: "withTransaction",
    value: function withTransaction(transactionManager) {
      if (!transactionManager) {
        return this;
      }

      var cloned = new ShopifyProductService({
        manager: transactionManager,
        options: this.options,
        shippingProfileService: this.shippingProfileService_,
        productVariantService: this.productVariantService_,
        productService: this.productService_,
        shopifyClientService: this.shopifyClientService
      });
      cloned.transactionManager_ = transactionManager;
      return cloned;
    }
    /**
     * Creates a product based on an event in Shopify.
     * Also adds the product to a collection if a collection id is provided
     * @param {object} data
     * @param {string} collectionId optional
     * @returns the created product
     */

  }, {
    key: "create",
    value: function () {
      var _create = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(data, collectionId) {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(manager) {
                    var existingProduct, shippingProfile, normalizedProduct, variants, product;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.next = 2;
                            return _this2.productService_.withTransaction(manager).retrieveByExternalId(data.id)["catch"](function (_) {
                              return undefined;
                            });

                          case 2:
                            existingProduct = _context2.sent;

                            if (!existingProduct) {
                              _context2.next = 5;
                              break;
                            }

                            return _context2.abrupt("return", existingProduct);

                          case 5:
                            normalizedProduct = _this2.normalizeProduct_(data, collectionId); // Get default shipping profile

                            if (!normalizedProduct.is_giftcard) {
                              _context2.next = 12;
                              break;
                            }

                            _context2.next = 9;
                            return _this2.shippingProfileService_.retrieveGiftCardDefault();

                          case 9:
                            shippingProfile = _context2.sent;
                            _context2.next = 15;
                            break;

                          case 12:
                            _context2.next = 14;
                            return _this2.shippingProfileService_.retrieveDefault();

                          case 14:
                            shippingProfile = _context2.sent;

                          case 15:
                            variants = normalizedProduct.variants;
                            delete normalizedProduct.variants;
                            normalizedProduct.profile_id = shippingProfile;
                            _context2.next = 20;
                            return _this2.productService_.withTransaction(manager).create(normalizedProduct);

                          case 20:
                            product = _context2.sent;

                            if (!(variants && variants.length)) {
                              _context2.next = 23;
                              break;
                            }

                            return _context2.delegateYield( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                              var optionIds, _iterator, _step, v, variant;

                              return regeneratorRuntime.wrap(function _callee$(_context) {
                                while (1) {
                                  switch (_context.prev = _context.next) {
                                    case 0:
                                      optionIds = normalizedProduct.options.map(function (option) {
                                        return product.options.find(function (newOption) {
                                          return newOption.title === option.title;
                                        }).id;
                                      });
                                      _iterator = _createForOfIteratorHelper(variants);
                                      _context.prev = 2;

                                      _iterator.s();

                                    case 4:
                                      if ((_step = _iterator.n()).done) {
                                        _context.next = 11;
                                        break;
                                      }

                                      v = _step.value;
                                      variant = _objectSpread(_objectSpread({}, v), {}, {
                                        options: v.options.map(function (option, index) {
                                          return _objectSpread(_objectSpread({}, option), {}, {
                                            option_id: optionIds[index]
                                          });
                                        })
                                      });
                                      _context.next = 9;
                                      return _this2.productVariantService_.withTransaction(manager).create(product.id, variant);

                                    case 9:
                                      _context.next = 4;
                                      break;

                                    case 11:
                                      _context.next = 16;
                                      break;

                                    case 13:
                                      _context.prev = 13;
                                      _context.t0 = _context["catch"](2);

                                      _iterator.e(_context.t0);

                                    case 16:
                                      _context.prev = 16;

                                      _iterator.f();

                                      return _context.finish(16);

                                    case 19:
                                    case "end":
                                      return _context.stop();
                                  }
                                }
                              }, _callee, null, [[2, 13, 16, 19]]);
                            })(), "t0", 23);

                          case 23:
                            return _context2.abrupt("return", product);

                          case 24:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));

                  return function (_x3) {
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

      function create(_x, _x2) {
        return _create.apply(this, arguments);
      }

      return create;
    }()
    /**
     * Updates a product based on an event in Shopify
     * @param {object} product
     * @returns
     */

  }, {
    key: "update",
    value: function () {
      var _update = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(product) {
        var _this3 = this;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(manager) {
                    var medusaProduct, _yield$_this3$client_, variants, normalizedUpdate, updates;

                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            _context5.next = 2;
                            return _this3.productService_.retrieveByHandle(product.handle, {
                              relations: ["variants"]
                            });

                          case 2:
                            medusaProduct = _context5.sent;
                            _context5.next = 5;
                            return _this3.client_.get({
                              path: "products/".concat(product.id),
                              extraHeaders: _const.INCLUDE_PRESENTMENT_PRICES
                            }).then(function (res) {
                              return res.body.product;
                            });

                          case 5:
                            _yield$_this3$client_ = _context5.sent;
                            variants = _yield$_this3$client_.variants;
                            product.variants = variants || [];
                            normalizedUpdate = _this3.normalizeProduct_(product);
                            updates = _lodash["default"].pickBy(normalizedUpdate, Boolean);
                            _context5.next = 12;
                            return Promise.all(updates.variants.map( /*#__PURE__*/function () {
                              var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(v) {
                                var match, variant, options;
                                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                  while (1) {
                                    switch (_context4.prev = _context4.next) {
                                      case 0:
                                        match = medusaProduct.variants.find(function (mv) {
                                          return mv.sku === v.sku;
                                        });

                                        if (!match) {
                                          _context4.next = 8;
                                          break;
                                        }

                                        _context4.next = 4;
                                        return _this3.productVariantService_.withTransaction(manager).retrieve(match.id, {
                                          relations: ["options"]
                                        });

                                      case 4:
                                        variant = _context4.sent;
                                        options = variant.options.map(function (option, i) {
                                          return _objectSpread(_objectSpread({}, option), v.options[i]);
                                        });
                                        v.options = options;
                                        v.id = variant.id;

                                      case 8:
                                        return _context4.abrupt("return", v);

                                      case 9:
                                      case "end":
                                        return _context4.stop();
                                    }
                                  }
                                }, _callee4);
                              }));

                              return function (_x6) {
                                return _ref4.apply(this, arguments);
                              };
                            }()));

                          case 12:
                            updates.variants = _context5.sent;
                            _context5.next = 15;
                            return _this3.productService_.withTransaction(manager).update(medusaProduct.id, updates);

                          case 15:
                            return _context5.abrupt("return", _context5.sent);

                          case 16:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5);
                  }));

                  return function (_x5) {
                    return _ref3.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function update(_x4) {
        return _update.apply(this, arguments);
      }

      return update;
    }()
    /**
     * Deletes a product based on an event in Shopify
     * @param {string} id
     * @returns
     */

  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(id) {
        var _this4 = this;

        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(manager) {
                    var product;
                    return regeneratorRuntime.wrap(function _callee7$(_context7) {
                      while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            _context7.next = 2;
                            return _this4.productService_.retrieveByExternalId(id);

                          case 2:
                            product = _context7.sent;
                            _context7.next = 5;
                            return _this4.productService_.withTransaction(manager)["delete"](product.id);

                          case 5:
                            return _context7.abrupt("return", _context7.sent);

                          case 6:
                          case "end":
                            return _context7.stop();
                        }
                      }
                    }, _callee7);
                  }));

                  return function (_x8) {
                    return _ref5.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function _delete(_x7) {
        return _delete2.apply(this, arguments);
      }

      return _delete;
    }()
  }, {
    key: "updateCollectionId",
    value: function () {
      var _updateCollectionId = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(productId, collectionId) {
        var _this5 = this;

        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(manager) {
                    return regeneratorRuntime.wrap(function _callee9$(_context9) {
                      while (1) {
                        switch (_context9.prev = _context9.next) {
                          case 0:
                            _context9.next = 2;
                            return _this5.productService_.withTransaction(manager).update(productId, {
                              collection_id: collectionId
                            });

                          case 2:
                            return _context9.abrupt("return", _context9.sent);

                          case 3:
                          case "end":
                            return _context9.stop();
                        }
                      }
                    }, _callee9);
                  }));

                  return function (_x11) {
                    return _ref6.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function updateCollectionId(_x9, _x10) {
        return _updateCollectionId.apply(this, arguments);
      }

      return updateCollectionId;
    }()
    /**
     * Normalizes a product, with a possible optional collection id
     * @param {object} product
     * @param {string} collectionId optional
     * @returns
     */

  }, {
    key: "normalizeProduct_",
    value: function normalizeProduct_(product, collectionId) {
      var _this6 = this,
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
          return _this6.normalizeProductOption_(option);
        }) || [],
        variants: product.variants.map(function (variant) {
          return _this6.normalizeVariant_(variant);
        }) || [],
        tags: product.tags.split(",").map(function (tag) {
          return _this6.normalizeTag_(tag);
        }) || [],
        images: product.images.map(function (img) {
          return img.src;
        }) || [],
        thumbnail: ((_product$image = product.image) === null || _product$image === void 0 ? void 0 : _product$image.src) || null,
        collection_id: collectionId || null,
        external_id: product.id,
        status: "proposed"
      };
    }
    /**
     * Normalizes a product option
     * @param {object} option
     * @returns
     */

  }, {
    key: "normalizeProductOption_",
    value: function normalizeProductOption_(option) {
      return {
        title: option.name,
        values: option.values.map(function (v) {
          return {
            value: v
          };
        })
      };
    }
    /**
     * Normalizes a product variant
     * @param {object} variant
     * @returns
     */

  }, {
    key: "normalizeVariant_",
    value: function normalizeVariant_(variant) {
      return {
        title: variant.title,
        prices: this.normalizePrices_(variant.presentment_prices),
        sku: variant.sku || null,
        barcode: variant.barcode || null,
        upc: variant.barcode || null,
        inventory_quantity: variant.inventory_quantity,
        variant_rank: variant.position,
        allow_backorder: variant.inventory_policy === "continue",
        manage_inventory: variant.inventory_management === "shopify",
        weight: variant.grams,
        options: this.normalizeVariantOptions_(variant.option1, variant.option2, variant.option3)
      };
    }
    /**
     * Normalizes an array of presentment prices
     * @param {array} presentmentPrices
     * @returns
     */

  }, {
    key: "normalizePrices_",
    value: function normalizePrices_(presentmentPrices) {
      return presentmentPrices.map(function (p) {
        return {
          amount: (0, _parsePrice.parsePrice)(p.price.amount),
          currency_code: p.price.currency_code.toLowerCase()
        };
      });
    }
    /**
     * Normalizes the three possble variant options
     * @param {string} option1
     * @param {string} option2
     * @param {string} option3
     * @returns
     */

  }, {
    key: "normalizeVariantOptions_",
    value: function normalizeVariantOptions_(option1, option2, option3) {
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
    /**
     * Normalizes a tag
     * @param {string} tag
     * @returns
     */

  }, {
    key: "normalizeTag_",
    value: function normalizeTag_(tag) {
      return {
        value: tag
      };
    }
  }]);

  return ShopifyProductService;
}(_medusaInterfaces.BaseService);

var _default = ShopifyProductService;
exports["default"] = _default;
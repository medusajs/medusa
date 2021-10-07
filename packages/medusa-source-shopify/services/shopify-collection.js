"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _medusaInterfaces = require("medusa-interfaces");

var _removeIndex = require("../utils/remove-index");

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

var ShopifyCollectionService = /*#__PURE__*/function (_BaseService) {
  _inherits(ShopifyCollectionService, _BaseService);

  var _super = _createSuper(ShopifyCollectionService);

  function ShopifyCollectionService(_ref, options) {
    var _this;

    var manager = _ref.manager,
        shopifyProductService = _ref.shopifyProductService,
        productCollectionService = _ref.productCollectionService;

    _classCallCheck(this, ShopifyCollectionService);

    _this = _super.call(this);
    _this.options = options;
    /** @private @const {EntityManager} */

    _this.manager_ = manager;
    /** @private @const {ShopifyProductService} */

    _this.productService_ = shopifyProductService;
    /** @private @const {ProductCollectionService} */

    _this.collectionService_ = productCollectionService;
    return _this;
  }

  _createClass(ShopifyCollectionService, [{
    key: "withTransaction",
    value: function withTransaction(transactionManager) {
      if (!transactionManager) {
        return this;
      }

      var cloned = new ShopifyCollectionService({
        manager: transactionManager,
        options: this.options,
        shopifyProductService: this.productService_,
        productCollectionService: this.collectionService_
      });
      cloned.transactionManager_ = transactionManager;
      return cloned;
    }
    /**
     *
     * @param {object[]} collects
     * @param {object[]} collections
     * @param {object[]} products
     * @returns {Promise}
     */

  }, {
    key: "createWithProducts",
    value: function () {
      var _createWithProducts = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(collects, collections, products) {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee2$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(manager) {
                    var normalizedCollections, result, _iterator, _step, _loop;

                    return regeneratorRuntime.wrap(function _callee$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            normalizedCollections = collections.map(function (c) {
                              return _this2.normalizeCollection_(c);
                            });
                            result = [];
                            _iterator = _createForOfIteratorHelper(normalizedCollections);
                            _context2.prev = 3;
                            _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop() {
                              var nc, collection, productIds, reducedProducts, _iterator2, _step2, product;

                              return regeneratorRuntime.wrap(function _loop$(_context) {
                                while (1) {
                                  switch (_context.prev = _context.next) {
                                    case 0:
                                      nc = _step.value;
                                      _context.next = 3;
                                      return _this2.collectionService_.retrieveByHandle(nc.handle)["catch"](function (_) {
                                        return undefined;
                                      });

                                    case 3:
                                      collection = _context.sent;

                                      if (collection) {
                                        _context.next = 8;
                                        break;
                                      }

                                      _context.next = 7;
                                      return _this2.collectionService_.withTransaction(manager).create(nc);

                                    case 7:
                                      collection = _context.sent;

                                    case 8:
                                      productIds = collects.reduce(function (productIds, c) {
                                        if (c.collection_id === collection.metadata.sh_id) {
                                          productIds.push(c.product_id);
                                        }

                                        return productIds;
                                      }, []);
                                      reducedProducts = products.reduce(function (reducedProducts, p) {
                                        if (productIds.includes(p.id)) {
                                          reducedProducts.push(p);
                                          (0, _removeIndex.removeIndex)(products, p);
                                        }

                                        return reducedProducts;
                                      }, []);
                                      _iterator2 = _createForOfIteratorHelper(reducedProducts);
                                      _context.prev = 11;

                                      _iterator2.s();

                                    case 13:
                                      if ((_step2 = _iterator2.n()).done) {
                                        _context.next = 19;
                                        break;
                                      }

                                      product = _step2.value;
                                      _context.next = 17;
                                      return _this2.productService_.withTransaction(manager).create(product, collection.id);

                                    case 17:
                                      _context.next = 13;
                                      break;

                                    case 19:
                                      _context.next = 24;
                                      break;

                                    case 21:
                                      _context.prev = 21;
                                      _context.t0 = _context["catch"](11);

                                      _iterator2.e(_context.t0);

                                    case 24:
                                      _context.prev = 24;

                                      _iterator2.f();

                                      return _context.finish(24);

                                    case 27:
                                      result.push(collection);

                                    case 28:
                                    case "end":
                                      return _context.stop();
                                  }
                                }
                              }, _loop, null, [[11, 21, 24, 27]]);
                            });

                            _iterator.s();

                          case 6:
                            if ((_step = _iterator.n()).done) {
                              _context2.next = 10;
                              break;
                            }

                            return _context2.delegateYield(_loop(), "t0", 8);

                          case 8:
                            _context2.next = 6;
                            break;

                          case 10:
                            _context2.next = 15;
                            break;

                          case 12:
                            _context2.prev = 12;
                            _context2.t1 = _context2["catch"](3);

                            _iterator.e(_context2.t1);

                          case 15:
                            _context2.prev = 15;

                            _iterator.f();

                            return _context2.finish(15);

                          case 18:
                            return _context2.abrupt("return", result);

                          case 19:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee, null, [[3, 12, 15, 18]]);
                  }));

                  return function (_x4) {
                    return _ref2.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee2, this);
      }));

      function createWithProducts(_x, _x2, _x3) {
        return _createWithProducts.apply(this, arguments);
      }

      return createWithProducts;
    }()
  }, {
    key: "normalizeCollection_",
    value: function normalizeCollection_(shopifyCollection) {
      return {
        title: shopifyCollection.title,
        handle: shopifyCollection.handle,
        metadata: {
          sh_id: shopifyCollection.id,
          sh_body: shopifyCollection.body_html
        }
      };
    }
  }]);

  return ShopifyCollectionService;
}(_medusaInterfaces.BaseService);

var _default = ShopifyCollectionService;
exports["default"] = _default;
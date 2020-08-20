"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _medusaInterfaces = require("medusa-interfaces");

var _contentfulManagement = require("contentful-management");

var _redis = _interopRequireDefault(require("redis"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ContentfulService = /*#__PURE__*/function (_BaseService) {
  _inherits(ContentfulService, _BaseService);

  var _super = _createSuper(ContentfulService);

  function ContentfulService(_ref, options) {
    var _this;

    var productService = _ref.productService,
        productVariantService = _ref.productVariantService,
        eventBusService = _ref.eventBusService;

    _classCallCheck(this, ContentfulService);

    _this = _super.call(this);
    _this.productService_ = productService;
    _this.productVariantService_ = productVariantService;
    _this.eventBus_ = eventBusService;
    _this.options_ = options;
    _this.contentful_ = (0, _contentfulManagement.createClient)({
      accessToken: options.access_token
    });
    _this.redis_ = _redis["default"].createClient();
    return _this;
  }

  _createClass(ContentfulService, [{
    key: "getIgnoreIds_",
    value: function () {
      var _getIgnoreIds_ = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(type) {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", new Promise(function (resolve, reject) {
                  _this2.redis_.get("".concat(type, "_ignore_ids"), function (err, reply) {
                    if (err) {
                      return reject(err);
                    }

                    return resolve(JSON.parse(reply));
                  });
                }));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getIgnoreIds_(_x) {
        return _getIgnoreIds_.apply(this, arguments);
      }

      return getIgnoreIds_;
    }()
  }, {
    key: "getContentfulEnvironment_",
    value: function () {
      var _getContentfulEnvironment_ = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var space, environment;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return this.contentful_.getSpace(this.options_.space_id);

              case 3:
                space = _context2.sent;
                _context2.next = 6;
                return space.getEnvironment(this.options_.environment);

              case 6:
                environment = _context2.sent;
                return _context2.abrupt("return", environment);

              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2["catch"](0);
                throw _context2.t0;

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 10]]);
      }));

      function getContentfulEnvironment_() {
        return _getContentfulEnvironment_.apply(this, arguments);
      }

      return getContentfulEnvironment_;
    }()
  }, {
    key: "getVariantEntries_",
    value: function () {
      var _getVariantEntries_ = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(productId) {
        var _this3 = this;

        var productVariants, contentfulVariants;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return this.productService_.retrieveVariants(productId);

              case 3:
                productVariants = _context3.sent;
                _context3.next = 6;
                return Promise.all(productVariants.map(function (variant) {
                  return _this3.updateProductVariantInContentful(variant);
                }));

              case 6:
                contentfulVariants = _context3.sent;
                return _context3.abrupt("return", contentfulVariants);

              case 10:
                _context3.prev = 10;
                _context3.t0 = _context3["catch"](0);
                console.log(_context3.t0);
                throw _context3.t0;

              case 14:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 10]]);
      }));

      function getVariantEntries_(_x2) {
        return _getVariantEntries_.apply(this, arguments);
      }

      return getVariantEntries_;
    }()
  }, {
    key: "getVariantLinks_",
    value: function getVariantLinks_(variantEntries) {
      return variantEntries.map(function (v) {
        return {
          sys: {
            type: "Link",
            linkType: "Entry",
            id: v.sys.id
          }
        };
      });
    }
  }, {
    key: "createProductInContentful",
    value: function () {
      var _createProductInContentful = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(product) {
        var environment, variantEntries, variantLinks, result, ignoreIds;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return this.getContentfulEnvironment_();

              case 3:
                environment = _context4.sent;
                _context4.next = 6;
                return this.getVariantEntries_(product._id);

              case 6:
                variantEntries = _context4.sent;
                variantLinks = this.getVariantLinks_(variantEntries);
                _context4.next = 10;
                return environment.createEntryWithId("product", product._id, {
                  fields: {
                    title: {
                      "en-US": product.title
                    },
                    variants: {
                      "en-US": variantLinks
                    },
                    objectId: {
                      "en-US": product._id
                    }
                  }
                });

              case 10:
                result = _context4.sent;
                _context4.next = 13;
                return this.getIgnoreIds_("product");

              case 13:
                _context4.t0 = _context4.sent;

                if (_context4.t0) {
                  _context4.next = 16;
                  break;
                }

                _context4.t0 = [];

              case 16:
                ignoreIds = _context4.t0;
                ignoreIds.push(product._id);
                this.redis_.set("product_ignore_ids", JSON.stringify(ignoreIds));
                return _context4.abrupt("return", result);

              case 22:
                _context4.prev = 22;
                _context4.t1 = _context4["catch"](0);
                throw _context4.t1;

              case 25:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 22]]);
      }));

      function createProductInContentful(_x3) {
        return _createProductInContentful.apply(this, arguments);
      }

      return createProductInContentful;
    }()
  }, {
    key: "createProductVariantInContentful",
    value: function () {
      var _createProductVariantInContentful = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(variant) {
        var environment, result, ignoreIds;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return this.getContentfulEnvironment_();

              case 3:
                environment = _context5.sent;
                _context5.next = 6;
                return environment.createEntryWithId("productVariant", variant._id, {
                  fields: {
                    title: {
                      "en-US": variant.title
                    },
                    sku: {
                      "en-US": variant.sku
                    },
                    prices: {
                      "en-US": variant.prices
                    },
                    objectId: {
                      "en-US": variant._id
                    }
                  }
                });

              case 6:
                result = _context5.sent;
                _context5.next = 9;
                return this.getIgnoreIds_("product_variant");

              case 9:
                _context5.t0 = _context5.sent;

                if (_context5.t0) {
                  _context5.next = 12;
                  break;
                }

                _context5.t0 = [];

              case 12:
                ignoreIds = _context5.t0;
                ignoreIds.push(variant._id);
                this.redis_.set("product_variant_ignore_ids", JSON.stringify(ignoreIds));
                return _context5.abrupt("return", result);

              case 18:
                _context5.prev = 18;
                _context5.t1 = _context5["catch"](0);
                throw _context5.t1;

              case 21:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 18]]);
      }));

      function createProductVariantInContentful(_x4) {
        return _createProductVariantInContentful.apply(this, arguments);
      }

      return createProductVariantInContentful;
    }()
  }, {
    key: "updateProductInContentful",
    value: function () {
      var _updateProductInContentful = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(product) {
        var ignoreIds, newIgnoreIds, environment, productEntry, variantEntries, variantLinks, updatedEntry, publishedEntry;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return this.getIgnoreIds_("product");

              case 3:
                _context6.t0 = _context6.sent;

                if (_context6.t0) {
                  _context6.next = 6;
                  break;
                }

                _context6.t0 = [];

              case 6:
                ignoreIds = _context6.t0;

                if (!ignoreIds.includes(product._id)) {
                  _context6.next = 13;
                  break;
                }

                newIgnoreIds = ignoreIds.filter(function (id) {
                  return id !== product._id;
                });
                this.redis_.set("product_ignore_ids", JSON.stringify(newIgnoreIds));
                return _context6.abrupt("return");

              case 13:
                ignoreIds.push(product._id);
                this.redis_.set("product_ignore_ids", JSON.stringify(ignoreIds));

              case 15:
                _context6.next = 17;
                return this.getContentfulEnvironment_();

              case 17:
                environment = _context6.sent;
                // check if product exists
                productEntry = undefined;
                _context6.prev = 19;
                _context6.next = 22;
                return environment.getEntry(product._id);

              case 22:
                productEntry = _context6.sent;
                _context6.next = 29;
                break;

              case 25:
                _context6.prev = 25;
                _context6.t1 = _context6["catch"](19);
                console.log(_context6.t1);
                return _context6.abrupt("return", this.createProductInContentful(product));

              case 29:
                _context6.next = 31;
                return this.getVariantEntries_(product._id);

              case 31:
                variantEntries = _context6.sent;
                variantLinks = this.getVariantLinks_(variantEntries);
                productEntry.fields = _lodash["default"].assignIn(productEntry.fields, {
                  title: {
                    "en-US": product.title
                  },
                  options: {
                    "en-US": product.options
                  },
                  variants: {
                    "en-US": variantLinks
                  },
                  objectId: {
                    "en-US": product._id
                  }
                });
                _context6.next = 36;
                return productEntry.update();

              case 36:
                updatedEntry = _context6.sent;
                _context6.next = 39;
                return updatedEntry.publish();

              case 39:
                publishedEntry = _context6.sent;
                return _context6.abrupt("return", publishedEntry);

              case 43:
                _context6.prev = 43;
                _context6.t2 = _context6["catch"](0);
                throw _context6.t2;

              case 46:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 43], [19, 25]]);
      }));

      function updateProductInContentful(_x5) {
        return _updateProductInContentful.apply(this, arguments);
      }

      return updateProductInContentful;
    }()
  }, {
    key: "updateProductVariantInContentful",
    value: function () {
      var _updateProductVariantInContentful = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(variant) {
        var ignoreIds, newIgnoreIds, environment, variantEntry, updatedEntry, publishedEntry;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return this.getIgnoreIds_("product_variant");

              case 3:
                _context7.t0 = _context7.sent;

                if (_context7.t0) {
                  _context7.next = 6;
                  break;
                }

                _context7.t0 = [];

              case 6:
                ignoreIds = _context7.t0;

                if (!ignoreIds.includes(variant._id)) {
                  _context7.next = 13;
                  break;
                }

                newIgnoreIds = ignoreIds.filter(function (id) {
                  return id !== variant._id;
                });
                this.redis_.set("product_variant_ignore_ids", JSON.stringify(newIgnoreIds));
                return _context7.abrupt("return");

              case 13:
                ignoreIds.push(variant._id);
                this.redis_.set("product_variant_ignore_ids", JSON.stringify(ignoreIds));

              case 15:
                _context7.next = 17;
                return this.getContentfulEnvironment_();

              case 17:
                environment = _context7.sent;
                // check if product exists
                variantEntry = undefined; // if not, we create a new one

                _context7.prev = 19;
                _context7.next = 22;
                return environment.getEntry(variant._id);

              case 22:
                variantEntry = _context7.sent;
                _context7.next = 28;
                break;

              case 25:
                _context7.prev = 25;
                _context7.t1 = _context7["catch"](19);
                return _context7.abrupt("return", this.createProductVariantInContentful(variant));

              case 28:
                variantEntry.fields = _lodash["default"].assignIn(variantEntry.fields, {
                  title: {
                    "en-US": variant.title
                  },
                  sku: {
                    "en-US": variant.sku
                  },
                  options: {
                    "en-US": variant.options
                  },
                  prices: {
                    "en-US": variant.prices
                  },
                  objectId: {
                    "en-US": variant._id
                  }
                });
                _context7.next = 31;
                return variantEntry.update();

              case 31:
                updatedEntry = _context7.sent;
                _context7.next = 34;
                return updatedEntry.publish();

              case 34:
                publishedEntry = _context7.sent;
                return _context7.abrupt("return", publishedEntry);

              case 38:
                _context7.prev = 38;
                _context7.t2 = _context7["catch"](0);
                throw _context7.t2;

              case 41:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[0, 38], [19, 25]]);
      }));

      function updateProductVariantInContentful(_x6) {
        return _updateProductVariantInContentful.apply(this, arguments);
      }

      return updateProductVariantInContentful;
    }()
  }, {
    key: "sendContentfulProductToAdmin",
    value: function () {
      var _sendContentfulProductToAdmin = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(productId) {
        var environment, productEntry, ignoreIds, newIgnoreIds, updatedProduct;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;
                _context8.next = 3;
                return this.getContentfulEnvironment_();

              case 3:
                environment = _context8.sent;
                _context8.next = 6;
                return environment.getEntry(productId);

              case 6:
                productEntry = _context8.sent;
                _context8.next = 9;
                return this.getIgnoreIds_("product");

              case 9:
                _context8.t0 = _context8.sent;

                if (_context8.t0) {
                  _context8.next = 12;
                  break;
                }

                _context8.t0 = [];

              case 12:
                ignoreIds = _context8.t0;

                if (!ignoreIds.includes(productId)) {
                  _context8.next = 19;
                  break;
                }

                newIgnoreIds = ignoreIds.filter(function (id) {
                  return id !== productId;
                });
                this.redis_.set("product_ignore_ids", JSON.stringify(newIgnoreIds));
                return _context8.abrupt("return");

              case 19:
                ignoreIds.push(productId);
                this.redis_.set("product_ignore_ids", JSON.stringify(ignoreIds));

              case 21:
                _context8.next = 23;
                return this.productService_.update(productId, {
                  title: productEntry.fields.title["en-US"]
                });

              case 23:
                updatedProduct = _context8.sent;
                return _context8.abrupt("return", updatedProduct);

              case 27:
                _context8.prev = 27;
                _context8.t1 = _context8["catch"](0);
                throw _context8.t1;

              case 30:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[0, 27]]);
      }));

      function sendContentfulProductToAdmin(_x7) {
        return _sendContentfulProductToAdmin.apply(this, arguments);
      }

      return sendContentfulProductToAdmin;
    }()
  }, {
    key: "sendContentfulProductVariantToAdmin",
    value: function () {
      var _sendContentfulProductVariantToAdmin = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(variantId) {
        var environment, variantEntry, ignoreIds, newIgnoreIds, updatedVariant;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;
                _context9.next = 3;
                return this.getContentfulEnvironment_();

              case 3:
                environment = _context9.sent;
                _context9.next = 6;
                return environment.getEntry(variantId);

              case 6:
                variantEntry = _context9.sent;
                _context9.next = 9;
                return this.getIgnoreIds_("product_variant");

              case 9:
                _context9.t0 = _context9.sent;

                if (_context9.t0) {
                  _context9.next = 12;
                  break;
                }

                _context9.t0 = [];

              case 12:
                ignoreIds = _context9.t0;

                if (!ignoreIds.includes(variantId)) {
                  _context9.next = 19;
                  break;
                }

                newIgnoreIds = ignoreIds.filter(function (id) {
                  return id !== variantId;
                });
                this.redis_.set("product_variant_ignore_ids", JSON.stringify(newIgnoreIds));
                return _context9.abrupt("return");

              case 19:
                ignoreIds.push(variantId);
                this.redis_.set("product_variant_ignore_ids", JSON.stringify(ignoreIds));

              case 21:
                _context9.next = 23;
                return this.productVariantService_.update(variantId, {
                  title: variantEntry.fields.title["en-US"]
                });

              case 23:
                updatedVariant = _context9.sent;
                return _context9.abrupt("return", updatedVariant);

              case 27:
                _context9.prev = 27;
                _context9.t1 = _context9["catch"](0);
                throw _context9.t1;

              case 30:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this, [[0, 27]]);
      }));

      function sendContentfulProductVariantToAdmin(_x8) {
        return _sendContentfulProductVariantToAdmin.apply(this, arguments);
      }

      return sendContentfulProductVariantToAdmin;
    }()
  }]);

  return ContentfulService;
}(_medusaInterfaces.BaseService);

var _default = ContentfulService;
exports["default"] = _default;
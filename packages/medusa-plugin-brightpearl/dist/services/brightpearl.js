"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _medusaInterfaces = require("medusa-interfaces");

var _brightpearl = _interopRequireDefault(require("../utils/brightpearl"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

var BrightpearlService = /*#__PURE__*/function (_BaseService) {
  _inherits(BrightpearlService, _BaseService);

  var _super = _createSuper(BrightpearlService);

  function BrightpearlService(_ref, options) {
    var _this;

    var oauthService = _ref.oauthService,
        totalsService = _ref.totalsService,
        productVariantService = _ref.productVariantService,
        regionService = _ref.regionService,
        orderService = _ref.orderService,
        discountService = _ref.discountService;

    _classCallCheck(this, BrightpearlService);

    _this = _super.call(this);
    _this.options = options;
    _this.productVariantService_ = productVariantService;
    _this.regionService_ = regionService;
    _this.orderService_ = orderService;
    _this.totalsService_ = totalsService;
    _this.discountService_ = discountService;
    _this.oauthService_ = oauthService;
    return _this;
  }

  _createClass(BrightpearlService, [{
    key: "getClient",
    value: function () {
      var _getClient = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var authData, data, client;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.brightpearlClient_) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", this.brightpearlClient_);

              case 2:
                _context.next = 4;
                return this.oauthService_.retrieveByName("brightpearl");

              case 4:
                authData = _context.sent;
                data = authData.data;

                if (!(!data || !data.access_token)) {
                  _context.next = 8;
                  break;
                }

                throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "You must authenticate the Brightpearl app in settings before continuing");

              case 8:
                client = new _brightpearl["default"]({
                  url: data.api_domain,
                  auth_type: data.token_type,
                  access_token: data.access_token
                });
                this.brightpearlClient_ = client;
                return _context.abrupt("return", client);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getClient() {
        return _getClient.apply(this, arguments);
      }

      return getClient;
    }()
  }, {
    key: "verifyWebhooks",
    value: function () {
      var _verifyWebhooks = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var brightpearl, hooks, installedHooks, _loop, _i, _hooks;

        return regeneratorRuntime.wrap(function _callee2$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.getClient();

              case 2:
                brightpearl = _context3.sent;
                hooks = [{
                  subscribeTo: "product.modified.on-hand-modified",
                  httpMethod: "POST",
                  uriTemplate: "".concat(this.options.backend_url, "/brightpearl/inventory-update"),
                  bodyTemplate: '{"account": "${account-code}", "lifecycleEvent": "${lifecycle-event}", "resourceType": "${resource-type}", "id": "${resource-id}" }',
                  contentType: "application/json",
                  idSetAccepted: false
                }];
                _context3.next = 6;
                return brightpearl.webhooks.list()["catch"](function () {
                  return [];
                });

              case 6:
                installedHooks = _context3.sent;
                _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop() {
                  var hook, isInstalled;
                  return regeneratorRuntime.wrap(function _loop$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          hook = _hooks[_i];
                          isInstalled = installedHooks.find(function (i) {
                            return i.subscribeTo === hook.subscribeTo && i.httpMethod === hook.httpMethod && i.uriTemplate === hook.uriTemplate && i.bodyTemplate === hook.bodyTemplate && i.contentType === hook.contentType && i.idSetAccepted === hook.idSetAccepted;
                          });

                          if (isInstalled) {
                            _context2.next = 5;
                            break;
                          }

                          _context2.next = 5;
                          return brightpearl.webhooks.create(hook);

                        case 5:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _loop);
                });
                _i = 0, _hooks = hooks;

              case 9:
                if (!(_i < _hooks.length)) {
                  _context3.next = 14;
                  break;
                }

                return _context3.delegateYield(_loop(), "t0", 11);

              case 11:
                _i++;
                _context3.next = 9;
                break;

              case 14:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee2, this);
      }));

      function verifyWebhooks() {
        return _verifyWebhooks.apply(this, arguments);
      }

      return verifyWebhooks;
    }()
  }, {
    key: "syncInventory",
    value: function () {
      var _syncInventory = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var _this2 = this;

        var client, variants;
        return regeneratorRuntime.wrap(function _callee4$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.getClient();

              case 2:
                client = _context5.sent;
                _context5.next = 5;
                return this.productVariantService_.list();

              case 5:
                variants = _context5.sent;
                return _context5.abrupt("return", Promise.all(variants.map( /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(v) {
                    var brightpearlProduct, productId, availability, onHand;
                    return regeneratorRuntime.wrap(function _callee3$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            _context4.next = 2;
                            return _this2.retrieveProductBySKU(v.sku);

                          case 2:
                            brightpearlProduct = _context4.sent;

                            if (brightpearlProduct) {
                              _context4.next = 5;
                              break;
                            }

                            return _context4.abrupt("return");

                          case 5:
                            productId = brightpearlProduct.productId;
                            _context4.next = 8;
                            return client.products.retrieveAvailability(productId);

                          case 8:
                            availability = _context4.sent;
                            onHand = availability[productId].total.onHand;
                            return _context4.abrupt("return", _this2.productVariantService_.update(v._id, {
                              inventory_quantity: onHand
                            }));

                          case 11:
                          case "end":
                            return _context4.stop();
                        }
                      }
                    }, _callee3);
                  }));

                  return function (_x) {
                    return _ref2.apply(this, arguments);
                  };
                }())));

              case 7:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee4, this);
      }));

      function syncInventory() {
        return _syncInventory.apply(this, arguments);
      }

      return syncInventory;
    }()
  }, {
    key: "updateInventory",
    value: function () {
      var _updateInventory = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(productId) {
        var client, brightpearlProduct, availability, onHand, sku, _yield$this$productVa, _yield$this$productVa2, variant;

        return regeneratorRuntime.wrap(function _callee5$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.getClient();

              case 2:
                client = _context6.sent;
                _context6.next = 5;
                return client.products.retrieve(productId);

              case 5:
                brightpearlProduct = _context6.sent;
                _context6.next = 8;
                return client.products.retrieveAvailability(productId);

              case 8:
                availability = _context6.sent;
                onHand = availability[productId].total.onHand;
                sku = brightpearlProduct.identity.sku;
                _context6.next = 13;
                return this.productVariantService_.list({
                  sku: sku
                });

              case 13:
                _yield$this$productVa = _context6.sent;
                _yield$this$productVa2 = _slicedToArray(_yield$this$productVa, 1);
                variant = _yield$this$productVa2[0];

                if (!(variant && variant.manage_inventory)) {
                  _context6.next = 19;
                  break;
                }

                _context6.next = 19;
                return this.productVariantService_.update(variant._id, {
                  inventory_quantity: onHand
                });

              case 19:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee5, this);
      }));

      function updateInventory(_x2) {
        return _updateInventory.apply(this, arguments);
      }

      return updateInventory;
    }()
  }, {
    key: "createGoodsOutNote",
    value: function () {
      var _createGoodsOutNote = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(fromOrder, shipment) {
        var client, id, order, productRows, goodsOut;
        return regeneratorRuntime.wrap(function _callee6$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.getClient();

              case 2:
                client = _context7.sent;
                id = fromOrder.metadata && fromOrder.metadata.brightpearl_sales_order_id;

                if (id) {
                  _context7.next = 6;
                  break;
                }

                return _context7.abrupt("return");

              case 6:
                _context7.next = 8;
                return client.orders.retrieve(id);

              case 8:
                order = _context7.sent;
                productRows = shipment.item_ids.map(function (id) {
                  var row = order.rows.find(function (_ref3) {
                    var externalRef = _ref3.externalRef;
                    return externalRef === id;
                  });
                  return {
                    productId: row.productId,
                    salesOrderRowId: row.id,
                    quantity: row.quantity
                  };
                });
                goodsOut = {
                  warehouses: [{
                    releaseDate: new Date(),
                    warehouseId: this.options.warehouse,
                    transfer: false,
                    products: productRows
                  }],
                  priority: false
                };
                return _context7.abrupt("return", client.warehouses.createGoodsOutNote(id, goodsOut));

              case 12:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee6, this);
      }));

      function createGoodsOutNote(_x3, _x4) {
        return _createGoodsOutNote.apply(this, arguments);
      }

      return createGoodsOutNote;
    }()
  }, {
    key: "registerGoodsOutShipped",
    value: function () {
      var _registerGoodsOutShipped = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(noteId, shipment) {
        var client;
        return regeneratorRuntime.wrap(function _callee7$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.getClient();

              case 2:
                client = _context8.sent;
                return _context8.abrupt("return", client.warehouses.registerGoodsOutEvent(noteId, {
                  events: [{
                    eventCode: "SHW",
                    occured: new Date(),
                    eventOwnerId: this.options.event_owner
                  }]
                }));

              case 4:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee7, this);
      }));

      function registerGoodsOutShipped(_x5, _x6) {
        return _registerGoodsOutShipped.apply(this, arguments);
      }

      return registerGoodsOutShipped;
    }()
  }, {
    key: "registerGoodsOutTrackingNumber",
    value: function () {
      var _registerGoodsOutTrackingNumber = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(noteId, shipment) {
        var client;
        return regeneratorRuntime.wrap(function _callee8$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this.getClient();

              case 2:
                client = _context9.sent;
                return _context9.abrupt("return", client.warehouses.updateGoodsOutNote(noteId, {
                  priority: false,
                  shipping: {
                    reference: shipment.tracking_number
                  }
                }));

              case 4:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee8, this);
      }));

      function registerGoodsOutTrackingNumber(_x7, _x8) {
        return _registerGoodsOutTrackingNumber.apply(this, arguments);
      }

      return registerGoodsOutTrackingNumber;
    }()
  }, {
    key: "createSalesOrder",
    value: function () {
      var _createSalesOrder = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(fromOrder) {
        var _this3 = this;

        var client, customer, shipping_address, order;
        return regeneratorRuntime.wrap(function _callee11$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return this.getClient();

              case 2:
                client = _context12.sent;
                _context12.next = 5;
                return this.retrieveCustomerByEmail(fromOrder.email);

              case 5:
                customer = _context12.sent;

                if (customer) {
                  _context12.next = 10;
                  break;
                }

                _context12.next = 9;
                return this.createCustomer(fromOrder);

              case 9:
                customer = _context12.sent;

              case 10:
                shipping_address = fromOrder.shipping_address;
                _context12.t0 = {
                  code: fromOrder.currency_code
                };
                _context12.t1 = fromOrder._id;
                _context12.t2 = {
                  id: customer.contactId,
                  address: {
                    addressFullName: "".concat(shipping_address.first_name, " ").concat(shipping_address.last_name),
                    addressLine1: shipping_address.address_1,
                    addressLine2: shipping_address.address_2,
                    postalCode: shipping_address.postal_code,
                    countryIsoCode: shipping_address.country_code,
                    telephone: shipping_address.phone,
                    email: fromOrder.email
                  }
                };
                _context12.t3 = {
                  shippingMethodId: 0,
                  address: {
                    addressFullName: "".concat(shipping_address.first_name, " ").concat(shipping_address.last_name),
                    addressLine1: shipping_address.address_1,
                    addressLine2: shipping_address.address_2,
                    postalCode: shipping_address.postal_code,
                    countryIsoCode: shipping_address.country_code,
                    telephone: shipping_address.phone,
                    email: fromOrder.email
                  }
                };
                _context12.next = 17;
                return this.getBrightpearlRows(fromOrder);

              case 17:
                _context12.t4 = _context12.sent;
                order = {
                  currency: _context12.t0,
                  externalRef: _context12.t1,
                  customer: _context12.t2,
                  delivery: _context12.t3,
                  rows: _context12.t4
                };
                return _context12.abrupt("return", client.orders.create(order).then( /*#__PURE__*/function () {
                  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(salesOrderId) {
                    var order, resResult;
                    return regeneratorRuntime.wrap(function _callee9$(_context10) {
                      while (1) {
                        switch (_context10.prev = _context10.next) {
                          case 0:
                            _context10.next = 2;
                            return client.orders.retrieve(salesOrderId);

                          case 2:
                            order = _context10.sent;
                            _context10.next = 5;
                            return client.warehouses.createReservation(order, _this3.options.warehouse);

                          case 5:
                            resResult = _context10.sent;
                            return _context10.abrupt("return", salesOrderId);

                          case 7:
                          case "end":
                            return _context10.stop();
                        }
                      }
                    }, _callee9);
                  }));

                  return function (_x10) {
                    return _ref4.apply(this, arguments);
                  };
                }()).then( /*#__PURE__*/function () {
                  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(salesOrderId) {
                    var paymentMethod, paymentType, payment, today, authExpire;
                    return regeneratorRuntime.wrap(function _callee10$(_context11) {
                      while (1) {
                        switch (_context11.prev = _context11.next) {
                          case 0:
                            paymentMethod = fromOrder.payment_method;
                            paymentType = "AUTH";
                            payment = {
                              transactionRef: "".concat(paymentMethod._id, ".").concat(paymentType),
                              // Brightpearl cannot accept an auth and capture with same ref
                              transactionCode: fromOrder._id,
                              paymentMethodCode: "1220",
                              orderId: salesOrderId,
                              currencyIsoCode: fromOrder.currency_code,
                              paymentDate: new Date(),
                              paymentType: paymentType
                            }; // Only if authorization type

                            if (!(paymentType === "AUTH")) {
                              _context11.next = 12;
                              break;
                            }

                            today = new Date();
                            authExpire = today.setDate(today.getDate() + 7);
                            _context11.next = 8;
                            return _this3.totalsService_.getTotal(fromOrder);

                          case 8:
                            payment.amountAuthorized = _context11.sent;
                            payment.authorizationExpiry = new Date(authExpire);
                            _context11.next = 12;
                            break;

                          case 12:
                            _context11.next = 14;
                            return client.payments.create(payment);

                          case 14:
                            return _context11.abrupt("return", salesOrderId);

                          case 15:
                          case "end":
                            return _context11.stop();
                        }
                      }
                    }, _callee10);
                  }));

                  return function (_x11) {
                    return _ref5.apply(this, arguments);
                  };
                }()).then(function (salesOrderId) {
                  return _this3.orderService_.setMetadata(fromOrder._id, "brightpearl_sales_order_id", salesOrderId);
                }));

              case 20:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee11, this);
      }));

      function createSalesOrder(_x9) {
        return _createSalesOrder.apply(this, arguments);
      }

      return createSalesOrder;
    }()
  }, {
    key: "createCapturedPayment",
    value: function () {
      var _createCapturedPayment = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(fromOrder) {
        var client, soId, paymentType, paymentMethod, payment;
        return regeneratorRuntime.wrap(function _callee12$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return this.getClient();

              case 2:
                client = _context13.sent;
                soId = fromOrder.metadata && fromOrder.metadata.brightpearl_sales_order_id;

                if (soId) {
                  _context13.next = 6;
                  break;
                }

                return _context13.abrupt("return");

              case 6:
                paymentType = "CAPTURE";
                paymentMethod = fromOrder.payment_method;
                _context13.t0 = "".concat(paymentMethod._id, ".").concat(paymentType);
                _context13.t1 = fromOrder._id;
                _context13.t2 = soId;
                _context13.t3 = new Date();
                _context13.t4 = fromOrder.currency_code;
                _context13.next = 15;
                return this.totalsService_.getTotal(fromOrder);

              case 15:
                _context13.t5 = _context13.sent;
                _context13.t6 = paymentType;
                payment = {
                  transactionRef: _context13.t0,
                  transactionCode: _context13.t1,
                  paymentMethodCode: "1220",
                  orderId: _context13.t2,
                  paymentDate: _context13.t3,
                  currencyIsoCode: _context13.t4,
                  amountPaid: _context13.t5,
                  paymentType: _context13.t6
                };
                _context13.next = 20;
                return client.payments.create(payment);

              case 20:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee12, this);
      }));

      function createCapturedPayment(_x12) {
        return _createCapturedPayment.apply(this, arguments);
      }

      return createCapturedPayment;
    }()
  }, {
    key: "getBrightpearlRows",
    value: function () {
      var _getBrightpearlRows = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(fromOrder) {
        var _this4 = this;

        var region, discount, lineDiscounts, lines, shippingTotal, shippingMethods;
        return regeneratorRuntime.wrap(function _callee14$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.next = 2;
                return this.regionService_.retrieve(fromOrder.region_id);

              case 2:
                region = _context15.sent;
                discount = fromOrder.discounts.find(function (_ref6) {
                  var discount_rule = _ref6.discount_rule;
                  return discount_rule.type !== "free_shipping";
                });
                lineDiscounts = [];

                if (discount) {
                  lineDiscounts = this.discountService_.getLineDiscounts(fromOrder, discount);
                }

                _context15.next = 8;
                return Promise.all(fromOrder.items.map( /*#__PURE__*/function () {
                  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(item) {
                    var bpProduct, discount, row;
                    return regeneratorRuntime.wrap(function _callee13$(_context14) {
                      while (1) {
                        switch (_context14.prev = _context14.next) {
                          case 0:
                            _context14.next = 2;
                            return _this4.retrieveProductBySKU(item.content.variant.sku);

                          case 2:
                            bpProduct = _context14.sent;
                            discount = lineDiscounts.find(function (l) {
                              return l.item._id.equals(item._id);
                            }) || {
                              amount: 0
                            };
                            row = {};

                            if (bpProduct) {
                              row.productId = bpProduct.productId;
                            } else {
                              row.name = item.title;
                            }

                            row.net = item.content.unit_price * item.quantity - discount.amount;
                            row.tax = row.net * fromOrder.tax_rate;
                            row.quantity = item.quantity;
                            row.taxCode = region.tax_code;
                            row.externalRef = item._id;
                            row.nominalCode = _this4.options.sales_account_code || "4000";
                            return _context14.abrupt("return", row);

                          case 13:
                          case "end":
                            return _context14.stop();
                        }
                      }
                    }, _callee13);
                  }));

                  return function (_x14) {
                    return _ref7.apply(this, arguments);
                  };
                }()));

              case 8:
                lines = _context15.sent;
                shippingTotal = this.totalsService_.getShippingTotal(fromOrder);
                shippingMethods = fromOrder.shipping_methods;

                if (shippingMethods.length > 0) {
                  lines.push({
                    name: "Shipping: ".concat(shippingMethods.map(function (m) {
                      return m.name;
                    }).join(" + ")),
                    quantity: 1,
                    net: shippingTotal,
                    tax: shippingTotal * fromOrder.tax_rate,
                    taxCode: region.tax_code,
                    nominalCode: this.options.shipping_account_code || "4040"
                  });
                }

                return _context15.abrupt("return", lines);

              case 13:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee14, this);
      }));

      function getBrightpearlRows(_x13) {
        return _getBrightpearlRows.apply(this, arguments);
      }

      return getBrightpearlRows;
    }()
  }, {
    key: "retrieveCustomerByEmail",
    value: function () {
      var _retrieveCustomerByEmail = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(email) {
        var client;
        return regeneratorRuntime.wrap(function _callee15$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.next = 2;
                return this.getClient();

              case 2:
                client = _context16.sent;
                return _context16.abrupt("return", client.customers.retrieveByEmail(email).then(function (customers) {
                  if (!customers.length) {
                    return null;
                  }

                  return customers.find(function (c) {
                    return c.primaryEmail === email;
                  });
                }));

              case 4:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee15, this);
      }));

      function retrieveCustomerByEmail(_x15) {
        return _retrieveCustomerByEmail.apply(this, arguments);
      }

      return retrieveCustomerByEmail;
    }()
  }, {
    key: "retrieveProductBySKU",
    value: function () {
      var _retrieveProductBySKU = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(sku) {
        var client;
        return regeneratorRuntime.wrap(function _callee16$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.next = 2;
                return this.getClient();

              case 2:
                client = _context17.sent;
                return _context17.abrupt("return", client.products.retrieveBySKU(sku).then(function (products) {
                  if (!products.length) {
                    return null;
                  }

                  return products[0];
                }));

              case 4:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee16, this);
      }));

      function retrieveProductBySKU(_x16) {
        return _retrieveProductBySKU.apply(this, arguments);
      }

      return retrieveProductBySKU;
    }()
  }, {
    key: "createCustomer",
    value: function () {
      var _createCustomer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(fromOrder) {
        var client, address, customer;
        return regeneratorRuntime.wrap(function _callee17$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                _context18.next = 2;
                return this.getClient();

              case 2:
                client = _context18.sent;
                _context18.next = 5;
                return client.addresses.create({
                  addressLine1: fromOrder.shipping_address.address_1,
                  addressLine2: fromOrder.shipping_address.address_2,
                  postalCode: fromOrder.shipping_address.postal_code,
                  countryIsoCode: fromOrder.shipping_address.country_code
                });

              case 5:
                address = _context18.sent;
                _context18.next = 8;
                return client.customers.create({
                  firstName: fromOrder.shipping_address.first_name,
                  lastName: fromOrder.shipping_address.last_name,
                  postAddressIds: {
                    DEF: address,
                    BIL: address,
                    DEL: address
                  }
                });

              case 8:
                customer = _context18.sent;
                return _context18.abrupt("return", {
                  contactId: customer
                });

              case 10:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee17, this);
      }));

      function createCustomer(_x17) {
        return _createCustomer.apply(this, arguments);
      }

      return createCustomer;
    }()
  }]);

  return BrightpearlService;
}(_medusaInterfaces.BaseService);

var _default = BrightpearlService;
exports["default"] = _default;
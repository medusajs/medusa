"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _axiosRateLimit = _interopRequireDefault(require("axios-rate-limit"));

var _querystring = _interopRequireDefault(require("querystring"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Brightpearl allows 200 requests per minute
var RATE_LIMIT_REQUESTS = 200;
var RATE_LIMIT_INTERVAL = 60 * 1000;

var BrightpearlClient = /*#__PURE__*/function () {
  _createClass(BrightpearlClient, null, [{
    key: "createToken",
    value: function createToken(account, data) {
      var params = {
        grant_type: "authorization_code",
        code: data.code,
        client_id: data.client_id,
        client_secret: data.client_secret,
        redirect_uri: data.redirect
      };
      return (0, _axios["default"])({
        url: "https://ws-eu1.brightpearl.com/".concat(account, "/oauth/token"),
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: _querystring["default"].stringify(params)
      }).then(function (_ref) {
        var data = _ref.data;
        return data;
      });
    }
  }, {
    key: "refreshToken",
    value: function refreshToken(account, data) {
      var params = {
        grant_type: "refresh_token",
        refresh_token: data.refresh_token,
        client_id: data.client_id,
        client_secret: data.client_secret
      };
      return (0, _axios["default"])({
        url: "https://ws-eu1.brightpearl.com/".concat(account, "/oauth/token"),
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: _querystring["default"].stringify(params)
      }).then(function (_ref2) {
        var data = _ref2.data;
        return data;
      });
    }
  }]);

  function BrightpearlClient(options, onRefreshToken) {
    var _this = this;

    _classCallCheck(this, BrightpearlClient);

    _defineProperty(this, "buildWebhookEndpoints", function () {
      return {
        list: function list() {
          return _this.client_.request({
            url: "/integration-service/webhook",
            method: "GET"
          }).then(function (_ref3) {
            var data = _ref3.data;
            return data.response;
          });
        },
        create: function create(data) {
          return _this.client_.request({
            url: "/integration-service/webhook",
            method: "POST",
            data: data
          });
        }
      };
    });

    _defineProperty(this, "buildPaymentEndpoints", function () {
      return {
        create: function create(payment) {
          return _this.client_.request({
            url: "/accounting-service/customer-payment",
            method: "POST",
            data: payment
          }).then(function (_ref4) {
            var data = _ref4.data;
            return data.response;
          });
        }
      };
    });

    _defineProperty(this, "buildWarehouseEndpoints", function () {
      return {
        retrieveReservation: function retrieveReservation(orderId) {
          return _this.client_.request({
            url: "/warehouse-service/order/".concat(orderId, "/reservation"),
            method: "GET"
          }).then(function (_ref5) {
            var data = _ref5.data;
            return data.response;
          });
        },
        retrieveGoodsOutNote: function retrieveGoodsOutNote(id) {
          return _this.client_.request({
            url: "/warehouse-service/order/*/goods-note/goods-out/".concat(id),
            method: "GET"
          }).then(function (_ref6) {
            var data = _ref6.data;
            return data.response && data.response[id];
          });
        },
        createGoodsOutNote: function createGoodsOutNote(orderId, data) {
          return _this.client_.request({
            url: "/warehouse-service/order/".concat(orderId, "/goods-note/goods-out"),
            method: "POST",
            data: data
          }).then(function (_ref7) {
            var data = _ref7.data;
            return data.response;
          });
        },
        updateGoodsOutNote: function updateGoodsOutNote(noteId, update) {
          return _this.client_.request({
            url: "/warehouse-service/goods-note/goods-out/".concat(noteId),
            method: "PUT",
            data: update
          });
        },
        registerGoodsOutEvent: function registerGoodsOutEvent(noteId, data) {
          return _this.client_.request({
            url: "/warehouse-service/goods-note/goods-out/".concat(noteId, "/event"),
            method: "POST",
            data: data
          });
        },
        createReservation: function createReservation(order, warehouse) {
          var id = order.id;
          var data = order.rows.map(function (r) {
            return {
              productId: r.productId,
              salesOrderRowId: r.id,
              quantity: r.quantity
            };
          });
          return _this.client_.request({
            url: "/warehouse-service/order/".concat(id, "/reservation/warehouse/").concat(warehouse),
            method: "POST",
            data: {
              products: data
            }
          }).then(function (_ref8) {
            var data = _ref8.data;
            return data.response;
          });
        }
      };
    });

    _defineProperty(this, "buildOrderEndpoints", function () {
      return {
        retrieve: function retrieve(orderId) {
          return _this.client_.request({
            url: "/order-service/sales-order/".concat(orderId),
            method: "GET"
          }).then(function (_ref9) {
            var data = _ref9.data;
            return data.response.length && data.response[0];
          })["catch"](function (err) {
            return console.log(err);
          });
        },
        create: function create(order) {
          return _this.client_.request({
            url: "/order-service/sales-order",
            method: "POST",
            data: order
          }).then(function (_ref10) {
            var data = _ref10.data;
            return data.response;
          });
        },
        createCredit: function createCredit(salesCredit) {
          return _this.client_.request({
            url: "/order-service/sales-credit",
            method: "POST",
            data: salesCredit
          }).then(function (_ref11) {
            var data = _ref11.data;
            return data.response;
          });
        }
      };
    });

    _defineProperty(this, "buildAddressEndpoints", function () {
      return {
        create: function create(address) {
          return _this.client_.request({
            url: "/contact-service/postal-address",
            method: "POST",
            data: address
          }).then(function (_ref12) {
            var data = _ref12.data;
            return data.response;
          });
        }
      };
    });

    _defineProperty(this, "buildProductEndpoints", function () {
      return {
        retrieveAvailability: function retrieveAvailability(productId) {
          return _this.client_.request({
            url: "/warehouse-service/product-availability/".concat(productId)
          }).then(function (_ref13) {
            var data = _ref13.data;
            return data.response && data.response;
          });
        },
        retrieve: function retrieve(productId) {
          return _this.client_.request({
            url: "/product-service/product/".concat(productId)
          }).then(function (_ref14) {
            var data = _ref14.data;
            return data.response && data.response[0];
          });
        },
        retrieveBySKU: function retrieveBySKU(sku) {
          return _this.client_.request({
            url: "/product-service/product-search?SKU=".concat(sku)
          }).then(function (_ref15) {
            var data = _ref15.data;
            return _this.buildSearchResults_(data.response);
          });
        }
      };
    });

    _defineProperty(this, "buildCustomerEndpoints", function () {
      return {
        retrieveByEmail: function retrieveByEmail(email) {
          return _this.client_.request({
            url: "/contact-service/contact-search?primaryEmail=".concat(email)
          }).then(function (_ref16) {
            var data = _ref16.data;
            return _this.buildSearchResults_(data.response);
          });
        },
        create: function create(customerData) {
          return _this.client_.request({
            url: "/contact-service/contact",
            method: "POST",
            data: customerData
          }).then(function (_ref17) {
            var data = _ref17.data;
            return data.response;
          });
        }
      };
    });

    this.client_ = (0, _axiosRateLimit["default"])(_axios["default"].create({
      baseURL: "https://".concat(options.url, "/public-api/").concat(options.account),
      headers: {
        "brightpearl-app-ref": "medusa-dev",
        "brightpearl-dev-ref": "sebrindom"
      }
    }), {
      maxRequests: RATE_LIMIT_REQUESTS,
      perMilliseconds: RATE_LIMIT_INTERVAL
    });
    this.authType_ = options.auth_type;
    this.token_ = options.access_token;
    this.webhooks = this.buildWebhookEndpoints();
    this.payments = this.buildPaymentEndpoints();
    this.warehouses = this.buildWarehouseEndpoints();
    this.orders = this.buildOrderEndpoints();
    this.addresses = this.buildAddressEndpoints();
    this.customers = this.buildCustomerEndpoints();
    this.products = this.buildProductEndpoints();
    this.buildRefreshTokenInterceptor_(onRefreshToken);
  }

  _createClass(BrightpearlClient, [{
    key: "updateAuth",
    value: function updateAuth(data) {
      if (data.auth_type) {
        this.authType_ = data.auth_type;
      }

      if (data.access_token) {
        this.token_ = data.access_token;
      }
    }
  }, {
    key: "buildRefreshTokenInterceptor_",
    value: function buildRefreshTokenInterceptor_(onRefresh) {
      var _this2 = this;

      this.client_.interceptors.request.use(function (request) {
        var authType = _this2.authType_;
        var token = _this2.token_;

        if (token) {
          request.headers["Authorization"] = "".concat(authType, " ").concat(token);
        }

        return request;
      });
      this.client_.interceptors.response.use(undefined, /*#__PURE__*/function () {
        var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(error) {
          var response;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  response = error.response;
                  console.log(response);

                  if (!response) {
                    _context.next = 15;
                    break;
                  }

                  if (!(response.status === 401 && error.config && !error.config.__isRetryRequest)) {
                    _context.next = 15;
                    break;
                  }

                  _context.prev = 4;
                  _context.next = 7;
                  return onRefresh(_this2);

                case 7:
                  _context.next = 13;
                  break;

                case 9:
                  _context.prev = 9;
                  _context.t0 = _context["catch"](4);
                  console.log(_context.t0); // refreshing has failed, but report the original error, i.e. 401

                  return _context.abrupt("return", Promise.reject(error));

                case 13:
                  // retry the original request
                  error.config.__isRetryRequest = true;
                  return _context.abrupt("return", _this2.client_(error.config));

                case 15:
                  return _context.abrupt("return", Promise.reject(error));

                case 16:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[4, 9]]);
        }));

        return function (_x) {
          return _ref18.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "buildSearchResults_",
    value: function buildSearchResults_(response) {
      var results = response.results,
          metaData = response.metaData; // Map the column names to the columns

      return results.map(function (resColumns) {
        var object = {};

        for (var i = 0; i < resColumns.length; i++) {
          var fieldName = metaData.columns[i].name;
          object[fieldName] = resColumns[i];
        }

        return object;
      });
    }
  }]);

  return BrightpearlClient;
}();

var _default = BrightpearlClient;
exports["default"] = _default;
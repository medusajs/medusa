"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _querystring = _interopRequireDefault(require("querystring"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  }]);

  function BrightpearlClient(options) {
    var _this = this;

    _classCallCheck(this, BrightpearlClient);

    _defineProperty(this, "buildWebhookEndpoints", function () {
      return {
        list: function list() {
          return _this.client_.request({
            url: "/integration-service/webhook",
            method: "GET"
          }).then(function (_ref2) {
            var data = _ref2.data;
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
          }).then(function (_ref3) {
            var data = _ref3.data;
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
          }).then(function (_ref4) {
            var data = _ref4.data;
            return data.response;
          });
        },
        retrieveGoodsOutNote: function retrieveGoodsOutNote(id) {
          return _this.client_.request({
            url: "/warehouse-service/order/*/goods-note/goods-out/".concat(id),
            method: "GET"
          }).then(function (_ref5) {
            var data = _ref5.data;
            return data.response && data.response[id];
          });
        },
        createGoodsOutNote: function createGoodsOutNote(orderId, data) {
          return _this.client_.request({
            url: "/warehouse-service/order/".concat(orderId, "/goods-note/goods-out"),
            method: "POST",
            data: data
          }).then(function (_ref6) {
            var data = _ref6.data;
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
          }).then(function (_ref7) {
            var data = _ref7.data;
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
          }).then(function (_ref8) {
            var data = _ref8.data;
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
          }).then(function (_ref9) {
            var data = _ref9.data;
            return data.response;
          });
        },
        createCredit: function createCredit(salesCredit) {
          return _this.client_.request({
            url: "/order-service/sales-credit",
            method: "POST",
            data: salesCredit
          }).then(function (_ref10) {
            var data = _ref10.data;
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
          }).then(function (_ref11) {
            var data = _ref11.data;
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
          }).then(function (_ref12) {
            var data = _ref12.data;
            return data.response && data.response;
          });
        },
        retrieve: function retrieve(productId) {
          return _this.client_.request({
            url: "/product-service/product/".concat(productId)
          }).then(function (_ref13) {
            var data = _ref13.data;
            return data.response && data.response[0];
          });
        },
        retrieveBySKU: function retrieveBySKU(sku) {
          return _this.client_.request({
            url: "/product-service/product-search?SKU=".concat(sku)
          }).then(function (_ref14) {
            var data = _ref14.data;
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
          }).then(function (_ref15) {
            var data = _ref15.data;
            return _this.buildSearchResults_(data.response);
          });
        },
        create: function create(customerData) {
          return _this.client_.request({
            url: "/contact-service/contact",
            method: "POST",
            data: customerData
          }).then(function (_ref16) {
            var data = _ref16.data;
            return data.response;
          });
        }
      };
    });

    this.client_ = _axios["default"].create({
      baseURL: "https://".concat(options.url, "/public-api/").concat(options.account),
      headers: {
        "brightpearl-app-ref": "medusa-dev",
        "brightpearl-dev-ref": "sebrindom",
        Authorization: "".concat(options.auth_type, " ").concat(options.access_token)
      }
    });
    this.webhooks = this.buildWebhookEndpoints();
    this.payments = this.buildPaymentEndpoints();
    this.warehouses = this.buildWarehouseEndpoints();
    this.orders = this.buildOrderEndpoints();
    this.addresses = this.buildAddressEndpoints();
    this.customers = this.buildCustomerEndpoints();
    this.products = this.buildProductEndpoints();
  }

  _createClass(BrightpearlClient, [{
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
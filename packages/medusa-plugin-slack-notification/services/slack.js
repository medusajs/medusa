"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _moment = _interopRequireDefault(require("moment"));

var _medusaInterfaces = require("medusa-interfaces");

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

var SlackService = /*#__PURE__*/function (_BaseService) {
  _inherits(SlackService, _BaseService);

  var _super = _createSuper(SlackService);

  /**
   * @param {Object} options - options defined in `medusa-config.js`
   *    {
   *      slack_url: "https://hooks.slack.com/services/..."
   *    }
   */
  function SlackService(_ref, options) {
    var _this;

    var orderService = _ref.orderService,
        totalsService = _ref.totalsService,
        regionService = _ref.regionService;

    _classCallCheck(this, SlackService);

    _this = _super.call(this);
    _this.orderService_ = orderService;
    _this.totalsService_ = totalsService;
    _this.regionService_ = regionService;
    _this.options_ = options;
    return _this;
  }

  _createClass(SlackService, [{
    key: "orderNotification",
    value: function () {
      var _orderNotification = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(orderId) {
        var order, subtotal, shippingTotal, taxTotal, discountTotal, total, blocks;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.orderService_.retrieve(orderId);

              case 2:
                order = _context.sent;
                _context.next = 5;
                return this.totalsService_.getSubtotal(order);

              case 5:
                subtotal = _context.sent;
                _context.next = 8;
                return this.totalsService_.getShippingTotal(order);

              case 8:
                shippingTotal = _context.sent;
                _context.next = 11;
                return this.totalsService_.getTaxTotal(order);

              case 11:
                taxTotal = _context.sent;
                _context.next = 14;
                return this.totalsService_.getDiscountTotal(order);

              case 14:
                discountTotal = _context.sent;
                _context.next = 17;
                return this.totalsService_.getTotal(order);

              case 17:
                total = _context.sent;
                blocks = [{
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: "Order *<http://localhost:8000/a/orders/".concat(order._id, "|#").concat(order._id, ">* has been processed.")
                  }
                }, {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: "*Customer*\n".concat(order.shipping_address.first_name, " ").concat(order.shipping_address.last_name, "\n").concat(order.email, "\n*Destination*\n").concat(order.shipping_address.address_1, "\n").concat(order.shipping_address.city, ", ").concat(order.shipping_address.country_code.toUpperCase())
                  }
                }, {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: "*Subtotal*\t".concat(subtotal, "\n*Shipping*\t").concat(shippingTotal, "\n*Discount Total*\t").concat(discountTotal, "\n*Tax*\t").concat(taxTotal, "\n*Total*\t").concat(total)
                  }
                }];
                blocks.push({
                  type: "divider"
                });
                order.items.forEach(function (lineItem) {
                  var line = {
                    type: "section",
                    text: {
                      type: "mrkdwn",
                      text: "*".concat(lineItem.title, "*\n").concat(lineItem.quantity, " x ").concat(!Array.isArray(lineItem.content) && lineItem.content.unit_price)
                    }
                  };

                  if (lineItem.thumbnail) {
                    line.accessory.type = "image";
                    line.accessory.image_url = lineItem.thumbnail;
                    line.accessory.alt_text = "Item";
                  }

                  blocks.push(line);
                  blocks.push({
                    type: "divider"
                  });
                });
                return _context.abrupt("return", _axios["default"].post(this.options_.slack_url, {
                  text: "Order ".concat(order._id, " was processed"),
                  blocks: blocks
                }));

              case 22:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function orderNotification(_x) {
        return _orderNotification.apply(this, arguments);
      }

      return orderNotification;
    }()
  }]);

  return SlackService;
}(_medusaInterfaces.BaseService);

var _default = SlackService;
exports["default"] = _default;
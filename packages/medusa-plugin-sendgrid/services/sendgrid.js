"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _medusaInterfaces = require("medusa-interfaces");

var _mail = _interopRequireDefault(require("@sendgrid/mail"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

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

var SendGridService = /*#__PURE__*/function (_BaseService) {
  _inherits(SendGridService, _BaseService);

  var _super = _createSuper(SendGridService);

  /**
   * @param {Object} options - options defined in `medusa-config.js`
   *    e.g.
   *    {
   *      api_key: SendGrid api key
   *      from: Medusa <hello@medusa.example>,
   *      order_placed_template: 01234,
   *      order_updated_template: 56789,
   *      order_cancelled_template: 4242,
   *      user_password_reset_template: 0000,
   *      customer_password_reset_template: 1111,
   *    }
   */
  function SendGridService(_ref, options) {
    var _this;

    _objectDestructuringEmpty(_ref);

    _classCallCheck(this, SendGridService);

    _this = _super.call(this);
    _this.options_ = options;

    _mail["default"].setApiKey(options.api_key);

    return _this;
  }
  /**
   * Sends a transactional email based on an event using SendGrid.
   * @param {string} event - event related to the order
   * @param {Object} order - the order object sent to SendGrid, that must
   *    correlate with the structure specificed in the dynamic template
   * @returns {Promise} result of the send operation
   */


  _createClass(SendGridService, [{
    key: "transactionalEmail",
    value: function () {
      var _transactionalEmail = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event, data) {
        var templateId;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.t0 = event;
                _context.next = _context.t0 === "order.gift_card_created" ? 3 : _context.t0 === "order.placed" ? 5 : _context.t0 === "order.updated" ? 7 : _context.t0 === "order.cancelled" ? 9 : _context.t0 === "order.completed" ? 11 : _context.t0 === "user.password_reset" ? 13 : _context.t0 === "customer.password_reset" ? 15 : 17;
                break;

              case 3:
                templateId = this.options_.gift_card_created_template;
                return _context.abrupt("break", 18);

              case 5:
                templateId = this.options_.order_placed_template;
                return _context.abrupt("break", 18);

              case 7:
                templateId = this.options_.order_updated_template;
                return _context.abrupt("break", 18);

              case 9:
                templateId = this.options_.order_cancelled_template;
                return _context.abrupt("break", 18);

              case 11:
                templateId = this.options_.order_completed_template;
                return _context.abrupt("break", 18);

              case 13:
                templateId = this.options_.user_password_reset_template;
                return _context.abrupt("break", 18);

              case 15:
                templateId = this.options_.customer_password_reset_template;
                return _context.abrupt("break", 18);

              case 17:
                return _context.abrupt("return");

              case 18:
                _context.prev = 18;

                if (!templateId) {
                  _context.next = 21;
                  break;
                }

                return _context.abrupt("return", _mail["default"].send({
                  template_id: templateId,
                  from: this.options_.from,
                  to: data.email,
                  dynamic_template_data: data
                }));

              case 21:
                _context.next = 26;
                break;

              case 23:
                _context.prev = 23;
                _context.t1 = _context["catch"](18);
                throw _context.t1;

              case 26:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[18, 23]]);
      }));

      function transactionalEmail(_x, _x2) {
        return _transactionalEmail.apply(this, arguments);
      }

      return transactionalEmail;
    }()
    /**
     * Sends an email using SendGrid.
     * @param {string} templateId - id of template in SendGrid
     * @param {string} from - sender of email
     * @param {string} to - receiver of email
     * @param {Object} data - data to send in mail (match with template)
     * @returns {Promise} result of the send operation
     */

  }, {
    key: "sendEmail",
    value: function () {
      var _sendEmail = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(templateId, from, to, data) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                return _context2.abrupt("return", _mail["default"].send({
                  to: to,
                  from: from,
                  template_id: templateId,
                  dynamic_template_data: data
                }));

              case 4:
                _context2.prev = 4;
                _context2.t0 = _context2["catch"](0);
                throw _context2.t0;

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 4]]);
      }));

      function sendEmail(_x3, _x4, _x5, _x6) {
        return _sendEmail.apply(this, arguments);
      }

      return sendEmail;
    }()
  }]);

  return SendGridService;
}(_medusaInterfaces.BaseService);

var _default = SendGridService;
exports["default"] = _default;
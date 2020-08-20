"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _randomatic = _interopRequireDefault(require("randomatic"));

var _medusaInterfaces = require("medusa-interfaces");

var _brightpearl = _interopRequireDefault(require("../utils/brightpearl"));

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

var CLIENT_SECRET = process.env.BP_CLIENT_SECRET || "";

var BrightpearlOauth = /*#__PURE__*/function (_OauthService) {
  _inherits(BrightpearlOauth, _OauthService);

  var _super = _createSuper(BrightpearlOauth);

  function BrightpearlOauth(_ref, options) {
    var _this;

    _objectDestructuringEmpty(_ref);

    _classCallCheck(this, BrightpearlOauth);

    _this = _super.call(this);
    _this.account_ = options.account;
    return _this;
  }

  _createClass(BrightpearlOauth, [{
    key: "generateToken",
    value: function () {
      var _generateToken = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(code) {
        var params, data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                params = {
                  client_id: "medusa-dev",
                  client_secret: CLIENT_SECRET,
                  redirect: "https://localhost:8000/a/oauth/brightpearl",
                  code: code
                };
                _context.next = 3;
                return _brightpearl["default"].createToken(this.account_, params);

              case 3:
                data = _context.sent;
                return _context.abrupt("return", data);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function generateToken(_x) {
        return _generateToken.apply(this, arguments);
      }

      return generateToken;
    }()
  }], [{
    key: "getAppDetails",
    value: function getAppDetails(options) {
      var client_id = "medusa-dev";
      var client_secret = CLIENT_SECRET;
      var state = (0, _randomatic["default"])("A0", 16);
      var redirect = "https://localhost:8000/a/oauth/brightpearl";
      return {
        application_name: "brightpearl",
        display_name: "Brightpearl",
        install_url: "https://oauth.brightpearl.com/authorize/".concat(options.account, "?response_type=code&client_id=").concat(client_id, "&redirect_uri=").concat(redirect, "&state=").concat(state),
        state: state
      };
    }
  }]);

  return BrightpearlOauth;
}(_medusaInterfaces.OauthService);

var _default = BrightpearlOauth;
exports["default"] = _default;
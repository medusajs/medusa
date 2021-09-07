"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _medusaInterfaces = require("medusa-interfaces");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

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

var S3Service = /*#__PURE__*/function (_FileService) {
  _inherits(S3Service, _FileService);

  var _super = _createSuper(S3Service);

  function S3Service(_ref, options) {
    var _this;

    _objectDestructuringEmpty(_ref);

    _classCallCheck(this, S3Service);

    _this = _super.call(this);
    _this.bucket_ = options.bucket;
    _this.spacesUrl_ = options.spaces_url;
    _this.accessKeyId_ = options.access_key_id;
    _this.secretAccessKey_ = options.secret_access_key;
    _this.region_ = options.region;
    _this.endpoint_ = options.endpoint;
    return _this;
  }

  _createClass(S3Service, [{
    key: "upload",
    value: function upload(file) {
      _awsSdk["default"].config.setPromisesDependency();

      _awsSdk["default"].config.update({
        accessKeyId: this.accessKeyId_,
        secretAccessKey: this.secretAccessKey_,
        region: this.region_,
        endpoint: this.endpoint_
      });

      var s3 = new _awsSdk["default"].S3();
      var params = {
        ACL: "public-read",
        Bucket: this.bucket_,
        Body: _fs["default"].createReadStream(file.path),
        Key: "".concat(file.originalname)
      };
      return new Promise(function (resolve, reject) {
        s3.upload(params, function (err, data) {
          if (err) {
            reject(err);
            return;
          }

          resolve({
            url: data.Location
          });
        });
      });
    }
  }, {
    key: "delete",
    value: function _delete(file) {
      _awsSdk["default"].config.setPromisesDependency();

      _awsSdk["default"].config.update({
        accessKeyId: this.accessKeyId_,
        secretAccessKey: this.secretAccessKey_,
        region: this.region_,
        endpoint: this.endpoint_
      });

      var s3 = new _awsSdk["default"].S3();
      var params = {
        Bucket: this.bucket_,
        Key: "".concat(file)
      };
      return new Promise(function (resolve, reject) {
        s3.deleteObject(params, function (err, data) {
          if (err) {
            reject(err);
            return;
          }

          resolve(data);
        });
      });
    }
  }]);

  return S3Service;
}(_medusaInterfaces.FileService);

var _default = S3Service;
exports["default"] = _default;
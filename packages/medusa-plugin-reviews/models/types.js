"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StringComparisonOperator = exports.NumericalComparisonOperator = void 0;

var _initializerDefineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerDefineProperty"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));

var _initializerWarningHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerWarningHelper"));

var _classValidator = require("class-validator");

var _classTransformer = require("class-transformer");

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _class3, _descriptor5, _descriptor6, _descriptor7, _descriptor8;

var NumericalComparisonOperator = (_dec = (0, _classValidator.IsNumber)(), _dec2 = (0, _classValidator.IsOptional)(), _dec3 = (0, _classTransformer.Type)(function () {
  return Number;
}), _dec4 = Reflect.metadata("design:type", Number), _dec5 = (0, _classValidator.IsNumber)(), _dec6 = (0, _classValidator.IsOptional)(), _dec7 = (0, _classTransformer.Type)(function () {
  return Number;
}), _dec8 = Reflect.metadata("design:type", Number), _dec9 = (0, _classValidator.IsNumber)(), _dec10 = (0, _classValidator.IsOptional)(), _dec11 = (0, _classTransformer.Type)(function () {
  return Number;
}), _dec12 = Reflect.metadata("design:type", Number), _dec13 = (0, _classValidator.IsNumber)(), _dec14 = (0, _classValidator.IsOptional)(), _dec15 = (0, _classTransformer.Type)(function () {
  return Number;
}), _dec16 = Reflect.metadata("design:type", Number), (_class = /*#__PURE__*/(0, _createClass2["default"])(function NumericalComparisonOperator() {
  (0, _classCallCheck2["default"])(this, NumericalComparisonOperator);
  (0, _initializerDefineProperty2["default"])(this, "lt", _descriptor, this);
  (0, _initializerDefineProperty2["default"])(this, "gt", _descriptor2, this);
  (0, _initializerDefineProperty2["default"])(this, "gte", _descriptor3, this);
  (0, _initializerDefineProperty2["default"])(this, "lte", _descriptor4, this);
}), (_descriptor = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "lt", [_dec, _dec2, _dec3, _dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "gt", [_dec5, _dec6, _dec7, _dec8], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "gte", [_dec9, _dec10, _dec11, _dec12], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "lte", [_dec13, _dec14, _dec15, _dec16], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class));
exports.NumericalComparisonOperator = NumericalComparisonOperator;
var StringComparisonOperator = (_dec17 = (0, _classValidator.IsString)(), _dec18 = (0, _classValidator.IsOptional)(), _dec19 = Reflect.metadata("design:type", String), _dec20 = (0, _classValidator.IsString)(), _dec21 = (0, _classValidator.IsOptional)(), _dec22 = Reflect.metadata("design:type", String), _dec23 = (0, _classValidator.IsString)(), _dec24 = (0, _classValidator.IsOptional)(), _dec25 = Reflect.metadata("design:type", String), _dec26 = (0, _classValidator.IsString)(), _dec27 = (0, _classValidator.IsOptional)(), _dec28 = Reflect.metadata("design:type", String), (_class3 = /*#__PURE__*/(0, _createClass2["default"])(function StringComparisonOperator() {
  (0, _classCallCheck2["default"])(this, StringComparisonOperator);
  (0, _initializerDefineProperty2["default"])(this, "lt", _descriptor5, this);
  (0, _initializerDefineProperty2["default"])(this, "gt", _descriptor6, this);
  (0, _initializerDefineProperty2["default"])(this, "gte", _descriptor7, this);
  (0, _initializerDefineProperty2["default"])(this, "lte", _descriptor8, this);
}), (_descriptor5 = (0, _applyDecoratedDescriptor2["default"])(_class3.prototype, "lt", [_dec17, _dec18, _dec19], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = (0, _applyDecoratedDescriptor2["default"])(_class3.prototype, "gt", [_dec20, _dec21, _dec22], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = (0, _applyDecoratedDescriptor2["default"])(_class3.prototype, "gte", [_dec23, _dec24, _dec25], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor8 = (0, _applyDecoratedDescriptor2["default"])(_class3.prototype, "lte", [_dec26, _dec27, _dec28], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class3));
exports.StringComparisonOperator = StringComparisonOperator;
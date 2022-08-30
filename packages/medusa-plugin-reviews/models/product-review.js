"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProductReview = void 0;

var _initializerDefineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerDefineProperty"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));

var _initializerWarningHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerWarningHelper"));

var _typeorm = require("typeorm");

var _medusa = require("@medusajs/medusa");

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9;

var ProductReview = (_dec = (0, _typeorm.Entity)(), _dec2 = (0, _typeorm.PrimaryColumn)(), _dec3 = Reflect.metadata("design:type", Number), _dec4 = (0, _typeorm.Column)(), _dec5 = Reflect.metadata("design:type", String), _dec6 = (0, _typeorm.ManyToOne)(function () {
  return _medusa.Product;
}, function (product) {
  return product.options;
}), _dec7 = (0, _typeorm.JoinColumn)({
  name: "product_id"
}), _dec8 = Reflect.metadata("design:type", typeof _medusa.Product === "undefined" ? Object : _medusa.Product), _dec9 = (0, _typeorm.Column)({
  type: "int"
}), _dec10 = Reflect.metadata("design:type", Number), _dec11 = (0, _typeorm.Column)(), _dec12 = Reflect.metadata("design:type", String), _dec13 = (0, _typeorm.Index)(), _dec14 = (0, _typeorm.Column)(), _dec15 = Reflect.metadata("design:type", String), _dec16 = (0, _typeorm.Column)(), _dec17 = Reflect.metadata("design:type", String), _dec18 = (0, _typeorm.CreateDateColumn)({
  type: "timestamptz"
}), _dec19 = Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date), _dec20 = (0, _typeorm.UpdateDateColumn)({
  type: "timestamptz"
}), _dec21 = Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date), _dec(_class = (_class2 = /*#__PURE__*/(0, _createClass2["default"])(function ProductReview() {
  (0, _classCallCheck2["default"])(this, ProductReview);
  (0, _initializerDefineProperty2["default"])(this, "id", _descriptor, this);
  (0, _initializerDefineProperty2["default"])(this, "product_id", _descriptor2, this);
  (0, _initializerDefineProperty2["default"])(this, "product", _descriptor3, this);
  (0, _initializerDefineProperty2["default"])(this, "rating", _descriptor4, this);
  (0, _initializerDefineProperty2["default"])(this, "body", _descriptor5, this);
  (0, _initializerDefineProperty2["default"])(this, "email", _descriptor6, this);
  (0, _initializerDefineProperty2["default"])(this, "name", _descriptor7, this);
  (0, _initializerDefineProperty2["default"])(this, "created_at", _descriptor8, this);
  (0, _initializerDefineProperty2["default"])(this, "updated_at", _descriptor9, this);
}), (_descriptor = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "id", [_dec2, _dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "product_id", [_dec4, _dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "product", [_dec6, _dec7, _dec8], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "rating", [_dec9, _dec10], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "body", [_dec11, _dec12], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "email", [_dec13, _dec14, _dec15], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "name", [_dec16, _dec17], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor8 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "created_at", [_dec18, _dec19], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor9 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "updated_at", [_dec20, _dec21], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class2)) || _class);
/**
 * @schema product_review
 * title: "Product Reviews"
 * description: "Product reviews represent a review made by a customer for a specific
 * product."
 * x-resourceId: product_review
 * properties:
 *   id:
 *     description: "The id of the Product Review. This value will be prefixed with
 *     `prev_`."
 *     type: string
 *   product_id:
 *     description: "The id of the Product that the Review is related to."
 *     type: string
 *   rating:
 *     description: "The rating value of customer that has given a review (1 - 5)."
 *     type: integer
 *   body:
 *     description: "The rating body text of customer that has given a review."
 *     type: string
 *   email:
 *     description: "The email of customer that has given a review."
 *     type: string
 *   name:
 *     description: "The name of customer that has given a review."
 *     type: string
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 */

exports.ProductReview = ProductReview;
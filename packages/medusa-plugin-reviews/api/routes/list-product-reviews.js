"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.StoreGetProductReviewsParams = void 0;

var _initializerDefineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerDefineProperty"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));

var _initializerWarningHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerWarningHelper"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classTransformer = require("class-transformer");

var _classValidator = require("class-validator");

var _validator = require("@medusajs/medusa/dist/utils/validator");

var _common = require("@medusajs/medusa/dist/types/common");

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;

var _excluded = ["limit", "offset"];

/**
 * @oas [get] /reviews
 * operationId: "GetProductReviews"
 * summary: "List Customer Product Reviews"
 * description: "Retrieve a list of Customer Product Reviews."
 * parameters:
 *   - (query) offset=0 {integer} The number of product reviews to skip before starting to
 *   collect the product reviews set
 *   - (query) limit=10 {integer} The number of product reviews to return
 *   - (query) product_id=p_xyz {string} The id of product to return its reviews
 *   - (query) email=example@email.com {string} The email of the customer who created
 *   the product reviews to return its product reviews
 * tags:
 *   - ProductReview
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            reviews:
 *              $ref: "#/components/schemas/product_review"
 */
var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var validated, limit, offset, filterableFields, productReviewService, listConfig, _yield$productReviewS, _yield$productReviewS2, reviews, count;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _validator.validator)(StoreGetProductReviewsParams, req.query);

          case 2:
            validated = _context.sent;
            limit = validated.limit, offset = validated.offset, filterableFields = (0, _objectWithoutProperties2["default"])(validated, _excluded);
            productReviewService = req.scope.resolve("productReviewService");
            listConfig = {
              skip: offset,
              take: limit
            };
            _context.next = 8;
            return productReviewService.listAndCount(filterableFields, listConfig);

          case 8:
            _yield$productReviewS = _context.sent;
            _yield$productReviewS2 = (0, _slicedToArray2["default"])(_yield$productReviewS, 2);
            reviews = _yield$productReviewS2[0];
            count = _yield$productReviewS2[1];
            res.status(200).json({
              reviews: reviews,
              count: count,
              limit: limit,
              offset: offset
            });

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;
var StoreGetProductReviewsParams = (_dec = (0, _classValidator.IsOptional)(), _dec2 = (0, _classValidator.IsInt)(), _dec3 = (0, _classTransformer.Type)(function () {
  return Number;
}), _dec4 = Reflect.metadata("design:type", Number), _dec5 = (0, _classValidator.IsOptional)(), _dec6 = (0, _classValidator.IsInt)(), _dec7 = (0, _classTransformer.Type)(function () {
  return Number;
}), _dec8 = Reflect.metadata("design:type", Number), _dec9 = (0, _classValidator.IsOptional)(), _dec10 = (0, _classValidator.ValidateNested)(), _dec11 = (0, _classTransformer.Type)(function () {
  return _common.DateComparisonOperator;
}), _dec12 = Reflect.metadata("design:type", typeof _common.DateComparisonOperator === "undefined" ? Object : _common.DateComparisonOperator), _dec13 = (0, _classValidator.IsOptional)(), _dec14 = (0, _classValidator.ValidateNested)(), _dec15 = (0, _classTransformer.Type)(function () {
  return _common.DateComparisonOperator;
}), _dec16 = Reflect.metadata("design:type", typeof _common.DateComparisonOperator === "undefined" ? Object : _common.DateComparisonOperator), _dec17 = (0, _classValidator.IsString)(), _dec18 = (0, _classValidator.IsOptional)(), _dec19 = (0, _classTransformer.Type)(function () {
  return String;
}), _dec20 = Reflect.metadata("design:type", String), _dec21 = (0, _classValidator.IsString)(), _dec22 = (0, _classValidator.IsOptional)(), _dec23 = (0, _classTransformer.Type)(function () {
  return String;
}), _dec24 = Reflect.metadata("design:type", String), (_class = /*#__PURE__*/(0, _createClass2["default"])(function StoreGetProductReviewsParams() {
  (0, _classCallCheck2["default"])(this, StoreGetProductReviewsParams);
  (0, _initializerDefineProperty2["default"])(this, "limit", _descriptor, this);
  (0, _initializerDefineProperty2["default"])(this, "offset", _descriptor2, this);
  (0, _initializerDefineProperty2["default"])(this, "created_at", _descriptor3, this);
  (0, _initializerDefineProperty2["default"])(this, "updated_at", _descriptor4, this);
  (0, _initializerDefineProperty2["default"])(this, "product_id", _descriptor5, this);
  (0, _initializerDefineProperty2["default"])(this, "email", _descriptor6, this);
}), (_descriptor = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "limit", [_dec, _dec2, _dec3, _dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 10;
  }
}), _descriptor2 = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "offset", [_dec5, _dec6, _dec7, _dec8], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor3 = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "created_at", [_dec9, _dec10, _dec11, _dec12], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "updated_at", [_dec13, _dec14, _dec15, _dec16], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "product_id", [_dec17, _dec18, _dec19, _dec20], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "email", [_dec21, _dec22, _dec23, _dec24], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class));
exports.StoreGetProductReviewsParams = StoreGetProductReviewsParams;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.StorePostProductReviewsReq = void 0;

var _initializerDefineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerDefineProperty"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));

var _initializerWarningHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerWarningHelper"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classValidator = require("class-validator");

var _validator = require("@medusajs/medusa/dist/utils/validator");

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;

/**
 * @oas [post] /reviews
 * operationId: "PostProductReviews"
 * summary: "Create a Customer Product Review"
 * description: "Creates a Customer Product Review."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - product_id
 *           - rating
 *           - email
 *         properties:
 *           product_id:
 *             type: string
 *             description:  The id to identify the product by.
 *           rating:
 *             type: number
 *             description:  The rating value from 1 to 5, describing the review.
 *           body:
 *             type: string
 *             description:  An optional body text to be as a description for the review.
 *           email:
 *             type: string
 *             description:  The email of the customer giving the review.
 *           name:
 *             type: string
 *             description:  The name of the customer giving the review.
 * tags:
 *   - ProductReview
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            review:
 *              $ref: "#/components/schemas/product_review"
 */
var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var validatedBody, productReviewService, productReview;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _validator.validator)(StorePostProductReviewsReq, req);

          case 2:
            validatedBody = _context.sent;
            productReviewService = req.scope.resolve("productReviewService");
            _context.next = 6;
            return productReviewService.create(validatedBody);

          case 6:
            productReview = _context.sent;
            res.status(200).json({
              productReview: productReview
            });

          case 8:
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
var StorePostProductReviewsReq = (_dec = (0, _classValidator.IsString)(), _dec2 = (0, _classValidator.IsNotEmpty)(), _dec3 = Reflect.metadata("design:type", String), _dec4 = (0, _classValidator.IsInt)(), _dec5 = (0, _classValidator.IsNotEmpty)(), _dec6 = Reflect.metadata("design:type", Number), _dec7 = (0, _classValidator.IsString)(), _dec8 = (0, _classValidator.IsOptional)(), _dec9 = Reflect.metadata("design:type", String), _dec10 = (0, _classValidator.IsString)(), _dec11 = (0, _classValidator.IsNotEmpty)(), _dec12 = Reflect.metadata("design:type", String), _dec13 = (0, _classValidator.IsString)(), _dec14 = (0, _classValidator.IsOptional)(), _dec15 = Reflect.metadata("design:type", String), (_class = /*#__PURE__*/(0, _createClass2["default"])(function StorePostProductReviewsReq() {
  (0, _classCallCheck2["default"])(this, StorePostProductReviewsReq);
  (0, _initializerDefineProperty2["default"])(this, "product_id", _descriptor, this);
  (0, _initializerDefineProperty2["default"])(this, "rating", _descriptor2, this);
  (0, _initializerDefineProperty2["default"])(this, "body", _descriptor3, this);
  (0, _initializerDefineProperty2["default"])(this, "email", _descriptor4, this);
  (0, _initializerDefineProperty2["default"])(this, "name", _descriptor5, this);
}), (_descriptor = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "product_id", [_dec, _dec2, _dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "rating", [_dec4, _dec5, _dec6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "body", [_dec7, _dec8, _dec9], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "email", [_dec10, _dec11, _dec12], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = (0, _applyDecoratedDescriptor2["default"])(_class.prototype, "name", [_dec13, _dec14, _dec15], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class));
exports.StorePostProductReviewsReq = StorePostProductReviewsReq;
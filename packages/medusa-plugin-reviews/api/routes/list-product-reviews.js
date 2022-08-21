"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _medusaCoreUtils = require("medusa-core-utils");

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
    var schema, _schema$validate, value, error, limit, offset, filterableFields, productReviewService, listConfig, _yield$productReviewS, _yield$productReviewS2, reviews, count;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            schema = _medusaCoreUtils.Validator.object().keys({
              limit: _medusaCoreUtils.Validator.number().optional()["default"](10),
              offset: _medusaCoreUtils.Validator.number().optional()["default"](0),
              created_at: _medusaCoreUtils.Validator.date().optional(),
              updated_at: _medusaCoreUtils.Validator.date().optional(),
              product_id: _medusaCoreUtils.Validator.string().optional(),
              email: _medusaCoreUtils.Validator.string().optional()
            });
            _schema$validate = schema.validate(req.query), value = _schema$validate.value, error = _schema$validate.error;

            if (!error) {
              _context.next = 4;
              break;
            }

            throw new _medusaCoreUtils.MedusaError(_medusaCoreUtils.MedusaError.Types.INVALID_DATA, error.details.join(", "));

          case 4:
            console.log(value);
            limit = value.limit, offset = value.offset, filterableFields = (0, _objectWithoutProperties2["default"])(value, _excluded);
            productReviewService = req.scope.resolve("productReviewService");
            listConfig = {
              skip: offset,
              take: limit
            };
            _context.next = 10;
            return productReviewService.listAndCount(filterableFields, listConfig);

          case 10:
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

          case 15:
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
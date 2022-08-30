"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _medusaCoreUtils = require("medusa-core-utils");

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
    var schema, _schema$validate, value, error, productReviewService, productReview;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            schema = _medusaCoreUtils.Validator.object().keys({
              product_id: _medusaCoreUtils.Validator.string().required(),
              rating: _medusaCoreUtils.Validator.number().required(),
              body: _medusaCoreUtils.Validator.string().optional(),
              email: _medusaCoreUtils.Validator.string().required(),
              name: _medusaCoreUtils.Validator.string().optional()
            });
            _schema$validate = schema.validate(req.body), value = _schema$validate.value, error = _schema$validate.error;

            if (!error) {
              _context.next = 4;
              break;
            }

            throw new _medusaCoreUtils.MedusaError(_medusaCoreUtils.MedusaError.Types.INVALID_DATA, error.details.join(", "));

          case 4:
            productReviewService = req.scope.resolve("productReviewService");
            _context.next = 7;
            return productReviewService.create(value);

          case 7:
            productReview = _context.sent;
            res.status(200).json({
              productReview: productReview
            });

          case 9:
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
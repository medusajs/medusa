"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addProductReview1658330229321 = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var addProductReview1658330229321 = /*#__PURE__*/function () {
  function addProductReview1658330229321() {
    (0, _classCallCheck2["default"])(this, addProductReview1658330229321);
    (0, _defineProperty2["default"])(this, "name", "addProductReview1658330229321");
  }

  (0, _createClass2["default"])(addProductReview1658330229321, [{
    key: "up",
    value: function () {
      var _up = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(queryRunner) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return queryRunner.query("CREATE TABLE \"product_review\" (\"id\" character varying NOT NULL, \"product_id\" character varying NOT NULL, \"rating\" integer NOT NULL, \"body\" character varying, \"email\" character varying NOT NULL, \"name\" character varying, CONSTRAINT \"PK_f62d1a5c2c0c40729a944b8a52b\" PRIMARY KEY (\"id\"))");

              case 2:
                _context.next = 4;
                return queryRunner.query("CREATE UNIQUE INDEX \"IDX_0c987a9dcec74ea199325ede4c\" ON \"product_review\" (\"email\") ");

              case 4:
                _context.next = 6;
                return queryRunner.query("ALTER TABLE \"product_review\" ADD CONSTRAINT \"FK_3f182d2d13c74174867224f14b8\" FOREIGN KEY (\"product_id\") REFERENCES \"product\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function up(_x) {
        return _up.apply(this, arguments);
      }

      return up;
    }()
  }, {
    key: "down",
    value: function () {
      var _down = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(queryRunner) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return queryRunner.query("ALTER TABLE \"product_review\" DROP CONSTRAINT \"FK_3f182d2d13c74174867224f14b8\"");

              case 2:
                _context2.next = 4;
                return queryRunner.query("DROP INDEX \"IDX_0c987a9dcec74ea199325ede4c\"");

              case 4:
                _context2.next = 6;
                return queryRunner.query("DROP TABLE \"product_review\"");

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function down(_x2) {
        return _down.apply(this, arguments);
      }

      return down;
    }()
  }]);
  return addProductReview1658330229321;
}();

exports.addProductReview1658330229321 = addProductReview1658330229321;
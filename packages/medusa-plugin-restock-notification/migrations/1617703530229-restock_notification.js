"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.restockNotification1617703530229 = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var restockNotification1617703530229 = /*#__PURE__*/function () {
  function restockNotification1617703530229() {
    (0, _classCallCheck2["default"])(this, restockNotification1617703530229);
    this.name = "restockNotification1617703530229";
  }

  (0, _createClass2["default"])(restockNotification1617703530229, [{
    key: "up",
    value: function () {
      var _up = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(queryRunner) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return queryRunner.query("CREATE TABLE \"restock_notification\" (\"variant_id\" character varying NOT NULL, \"emails\" jsonb NOT NULL, \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT \"PK_49181ca04caac807fcec321705a\" PRIMARY KEY (\"variant_id\"))");

              case 2:
                _context.next = 4;
                return queryRunner.query("ALTER TABLE \"restock_notification\" ADD CONSTRAINT \"FK_49181ca04caac807fcec321705a\" FOREIGN KEY (\"variant_id\") REFERENCES \"product_variant\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");

              case 4:
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
                return queryRunner.query("ALTER TABLE \"restock_notification\" DROP CONSTRAINT \"FK_49181ca04caac807fcec321705a\"");

              case 2:
                _context2.next = 4;
                return queryRunner.query("DROP TABLE \"restock_notification\"");

              case 4:
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
  return restockNotification1617703530229;
}();

exports.restockNotification1617703530229 = restockNotification1617703530229;
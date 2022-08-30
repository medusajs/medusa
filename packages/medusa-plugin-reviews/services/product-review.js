"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _medusaInterfaces = require("medusa-interfaces");

var _buildQuery = require("../utils/build-query");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ProductReviewService = /*#__PURE__*/function (_BaseService) {
  (0, _inherits2["default"])(ProductReviewService, _BaseService);

  var _super = _createSuper(ProductReviewService);

  function ProductReviewService(_ref) {
    var _this;

    var manager = _ref.manager,
        productReviewModel = _ref.productReviewModel;
    (0, _classCallCheck2["default"])(this, ProductReviewService);
    _this = _super.call(this);
    _this.manager_ = manager;
    _this.productReviewModel_ = productReviewModel;
    return _this;
  }

  (0, _createClass2["default"])(ProductReviewService, [{
    key: "withTransaction",
    value: function withTransaction(transactionManager) {
      if (!transactionManager) {
        return this;
      }

      var cloned = new ProductReviewService({
        manager: transactionManager,
        productReviewModel: this.productReviewModel_
      });
      cloned.transactionManager_ = transactionManager;
      return cloned;
    }
    /**
     * Lists customer product reviews based on the provided parameters.
     * @param selector - an object that defines rules to filter customer product reviews
     *   by
     * @param config - object that defines the scope for what should be
     *   returned
     * @return the result of the find operation
     */

  }, {
    key: "list",
    value: function () {
      var _list = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var _this2 = this;

        var selector,
            config,
            _args2 = arguments;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                selector = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
                config = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {
                  relations: [],
                  skip: 0,
                  take: 20
                };
                return _context2.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(manager) {
                    var repository, query;
                    return _regenerator["default"].wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            repository = manager.getRepository(_this2.productReviewModel_);
                            query = _this2.buildQuery_(selector, config);
                            _context.next = 4;
                            return repository.find(query);

                          case 4:
                            return _context.abrupt("return", _context.sent);

                          case 5:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x) {
                    return _ref2.apply(this, arguments);
                  };
                }()));

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function list() {
        return _list.apply(this, arguments);
      }

      return list;
    }()
    /**
     * Return the total number of documents in database
     * @param {object} selector - the selector to choose customer product reviews by
     * @return {Promise} the result of the count operation
     */

  }, {
    key: "count",
    value: function () {
      var _count = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        var _this3 = this;

        var selector,
            _args4 = arguments;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                selector = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : {};
                return _context4.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(manager) {
                    var repository, query;
                    return _regenerator["default"].wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            repository = manager.getRepository(_this3.productReviewModel_);
                            query = (0, _buildQuery.buildQuery)(selector);
                            _context3.next = 4;
                            return repository.count(query);

                          case 4:
                            return _context3.abrupt("return", _context3.sent);

                          case 5:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));

                  return function (_x2) {
                    return _ref3.apply(this, arguments);
                  };
                }()));

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function count() {
        return _count.apply(this, arguments);
      }

      return count;
    }()
    /**
     * Gets a customer product review by product_id.
     * Throws in case of DB Error and if customer product reviews was not found.
     * @param productId - id of the product to get.
     * @return the result of the find one operation.
     */

  }, {
    key: "retrieve",
    value: function () {
      var _retrieve = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(productId) {
        var repository;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                repository = this.manager_.getRepository(this.productReviewModel_);
                _context5.next = 3;
                return repository.findOne({
                  where: {
                    product_id: productId
                  }
                });

              case 3:
                return _context5.abrupt("return", _context5.sent);

              case 4:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function retrieve(_x3) {
        return _retrieve.apply(this, arguments);
      }

      return retrieve;
    }()
    /**
     * Gets a product review by email.
     * Throws in case of DB Error and if product review was not found.
     * @param email - email of the product review to get.
     * @return the result of the find one operation.
     */

  }, {
    key: "retrieveByEmail",
    value: function () {
      var _retrieveByEmail = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(email) {
        var repository;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                repository = this.manager_.getRepository(this.productReviewModel_);
                _context6.next = 3;
                return repository.findOne({
                  where: {
                    email: email
                  }
                });

              case 3:
                return _context6.abrupt("return", _context6.sent);

              case 4:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function retrieveByEmail(_x4) {
        return _retrieveByEmail.apply(this, arguments);
      }

      return retrieveByEmail;
    }()
    /**
     * Creates a product.
     * @param productReviewObject - the product to create
     * @return resolves to the creation result.
     */

  }, {
    key: "create",
    value: function () {
      var _create = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(productReviewObject) {
        var _this4 = this;

        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(manager) {
                    var repository, rest, productReview;
                    return _regenerator["default"].wrap(function _callee7$(_context7) {
                      while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            repository = manager.getRepository(_this4.productReviewModel_);
                            rest = (0, _extends2["default"])({}, productReviewObject);
                            _context7.prev = 2;
                            productReview = repository.create(rest);
                            _context7.next = 6;
                            return repository.save(productReview);

                          case 6:
                            return _context7.abrupt("return", _context7.sent);

                          case 9:
                            _context7.prev = 9;
                            _context7.t0 = _context7["catch"](2);
                            console.log(_context7.t0);

                          case 12:
                          case "end":
                            return _context7.stop();
                        }
                      }
                    }, _callee7, null, [[2, 9]]);
                  }));

                  return function (_x6) {
                    return _ref4.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function create(_x5) {
        return _create.apply(this, arguments);
      }

      return create;
    }()
  }]);
  return ProductReviewService;
}(_medusaInterfaces.BaseService);

var _default = ProductReviewService;
exports["default"] = _default;
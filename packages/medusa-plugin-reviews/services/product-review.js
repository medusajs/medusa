"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _medusaCoreUtils = require("medusa-core-utils");

var _medusaInterfaces = require("medusa-interfaces");

var _buildQuery2 = require("../utils/build-query");

var _excluded = ["relations"];

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ProductReviewService = /*#__PURE__*/function (_BaseService) {
  (0, _inherits2["default"])(ProductReviewService, _BaseService);

  var _super = _createSuper(ProductReviewService);

  function ProductReviewService(_ref) {
    var _this;

    var manager = _ref.manager,
        productReviewService = _ref.productReviewService,
        eventBusService = _ref.eventBusService;
    (0, _classCallCheck2["default"])(this, ProductReviewService);
    _this = _super.call(this);
    _this.manager_ = manager;
    _this.productReviewService_ = productReviewService;
    _this.eventBus_ = eventBusService;
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
        eventBusService: this.eventBus_,
        productReviewService: this.productReviewService_
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
                    var repository, _this2$prepareListQue, q, query, relations, _yield$repository$get, _yield$repository$get2, products;

                    return _regenerator["default"].wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            repository = manager.getRepository(_this2.productReviewService_);
                            _this2$prepareListQue = _this2.prepareListQuery_(selector, config), q = _this2$prepareListQue.q, query = _this2$prepareListQue.query, relations = _this2$prepareListQue.relations;

                            if (!q) {
                              _context.next = 9;
                              break;
                            }

                            _context.next = 5;
                            return repository.getFreeTextSearchResultsAndCount(q, query, relations);

                          case 5:
                            _yield$repository$get = _context.sent;
                            _yield$repository$get2 = (0, _slicedToArray2["default"])(_yield$repository$get, 1);
                            products = _yield$repository$get2[0];
                            return _context.abrupt("return", products);

                          case 9:
                            _context.next = 11;
                            return repository.findWithRelations(relations, query);

                          case 11:
                            return _context.abrupt("return", _context.sent);

                          case 12:
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
     * Lists products based on the provided parameters and includes the count of
     * customer product reviews that match the query.
     * @param selector - an object that defines rules to filter customer product reviews
     *   by
     * @param config - object that defines the scope for what should be
     *   returned
     * @return an array containing the customer product reviews as
     *   the first element and the total count of customer product reviews that matches the query
     *   as the second element.
     */

  }, {
    key: "listAndCount",
    value: function () {
      var _listAndCount = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        var _this3 = this;

        var selector,
            config,
            _args4 = arguments;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                selector = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : {};
                config = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {
                  relations: [],
                  skip: 0,
                  take: 20
                };
                return _context4.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(manager) {
                    var repository, _this3$prepareListQue, q, query, relations;

                    return _regenerator["default"].wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            repository = manager.getRepository(_this3.productReviewService_);
                            _this3$prepareListQue = _this3.prepareListQuery_(selector, config), q = _this3$prepareListQue.q, query = _this3$prepareListQue.query, relations = _this3$prepareListQue.relations;

                            if (!q) {
                              _context3.next = 6;
                              break;
                            }

                            _context3.next = 5;
                            return repository.getFreeTextSearchResultsAndCount(q, query, relations);

                          case 5:
                            return _context3.abrupt("return", _context3.sent);

                          case 6:
                            _context3.next = 8;
                            return repository.findWithRelationsAndCount(relations, query);

                          case 8:
                            return _context3.abrupt("return", _context3.sent);

                          case 9:
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

              case 3:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function listAndCount() {
        return _listAndCount.apply(this, arguments);
      }

      return listAndCount;
    }()
    /**
     * Return the total number of documents in database
     * @param {object} selector - the selector to choose customer product reviews by
     * @return {Promise} the result of the count operation
     */

  }, {
    key: "count",
    value: function () {
      var _count = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
        var _this4 = this;

        var selector,
            _args6 = arguments;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                selector = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : {};
                return _context6.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(manager) {
                    var repository, query;
                    return _regenerator["default"].wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            repository = manager.getRepository(_this4.productReviewService_);
                            query = (0, _buildQuery2.buildQuery)(selector);
                            _context5.next = 4;
                            return repository.count(query);

                          case 4:
                            return _context5.abrupt("return", _context5.sent);

                          case 5:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5);
                  }));

                  return function (_x3) {
                    return _ref4.apply(this, arguments);
                  };
                }()));

              case 2:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
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
      var _retrieve = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(productId) {
        var repository;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                repository = this.manager_.getRepository(this.productReviewService_);
                _context7.next = 3;
                return repository.findOne({
                  where: {
                    product_id: productId
                  }
                });

              case 3:
                return _context7.abrupt("return", _context7.sent);

              case 4:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function retrieve(_x4) {
        return _retrieve.apply(this, arguments);
      }

      return retrieve;
    }()
    /**
     * Gets a product review by email.
     * Throws in case of DB Error and if product review was not found.
     * @param email - email of the product review to get.
     * @param config - details about what to get from the product
     * @return the result of the find one operation.
     */

  }, {
    key: "retrieveByEmail",
    value: function () {
      var _retrieveByEmail = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(email) {
        var config,
            _args8 = arguments;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                config = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : {};
                _context8.next = 3;
                return this.retrieve_({
                  email: email
                }, config);

              case 3:
                return _context8.abrupt("return", _context8.sent);

              case 4:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function retrieveByEmail(_x5) {
        return _retrieveByEmail.apply(this, arguments);
      }

      return retrieveByEmail;
    }()
    /**
     * Gets a product by selector.
     * Throws in case of DB Error and if product was not found.
     * @param selector - selector object
     * @param config - object that defines what should be included in the
     *   query response
     * @return the result of the find one operation.
     */

  }, {
    key: "retrieve_",
    value: function () {
      var _retrieve_ = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(selector) {
        var _this5 = this;

        var config,
            _args10 = arguments;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                config = _args10.length > 1 && _args10[1] !== undefined ? _args10[1] : {};
                return _context10.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(manager) {
                    var repository, _buildQuery, relations, query, productReview, selectorConstraints;

                    return _regenerator["default"].wrap(function _callee9$(_context9) {
                      while (1) {
                        switch (_context9.prev = _context9.next) {
                          case 0:
                            repository = manager.getRepository(_this5.productReviewService_);
                            _buildQuery = (0, _buildQuery2.buildQuery)(selector, config), relations = _buildQuery.relations, query = (0, _objectWithoutProperties2["default"])(_buildQuery, _excluded);
                            _context9.next = 4;
                            return repository.findOneWithRelations(relations, query);

                          case 4:
                            productReview = _context9.sent;

                            if (productReview) {
                              _context9.next = 8;
                              break;
                            }

                            selectorConstraints = Object.entries(selector).map(function (_ref6) {
                              var _ref7 = (0, _slicedToArray2["default"])(_ref6, 2),
                                  key = _ref7[0],
                                  value = _ref7[1];

                              return "".concat(key, ": ").concat(value);
                            }).join(", ");
                            throw new _medusaCoreUtils.MedusaError(_medusaCoreUtils.MedusaError.Types.NOT_FOUND, "Product with ".concat(selectorConstraints, " was not found"));

                          case 8:
                            return _context9.abrupt("return", productReview);

                          case 9:
                          case "end":
                            return _context9.stop();
                        }
                      }
                    }, _callee9);
                  }));

                  return function (_x7) {
                    return _ref5.apply(this, arguments);
                  };
                }()));

              case 2:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function retrieve_(_x6) {
        return _retrieve_.apply(this, arguments);
      }

      return retrieve_;
    }()
    /**
     * Creates a product.
     * @param productReviewObject - the product to create
     * @return resolves to the creation result.
     */

  }, {
    key: "create",
    value: function () {
      var _create = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(productReviewObject) {
        var _this6 = this;

        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                return _context12.abrupt("return", this.atomicPhase_( /*#__PURE__*/function () {
                  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(manager) {
                    var repository, rest, productReview;
                    return _regenerator["default"].wrap(function _callee11$(_context11) {
                      while (1) {
                        switch (_context11.prev = _context11.next) {
                          case 0:
                            repository = manager.getRepository(_this6.productReviewService_);
                            rest = (0, _extends2["default"])({}, productReviewObject);
                            _context11.prev = 2;
                            productReview = repository.create(rest);
                            _context11.next = 6;
                            return repository.save(productReview);

                          case 6:
                            productReview = _context11.sent;
                            _context11.next = 9;
                            return _this6.retrieve(productReview.id);

                          case 9:
                            return _context11.abrupt("return", _context11.sent);

                          case 12:
                            _context11.prev = 12;
                            _context11.t0 = _context11["catch"](2);
                            console.log(_context11.t0);

                          case 15:
                          case "end":
                            return _context11.stop();
                        }
                      }
                    }, _callee11, null, [[2, 12]]);
                  }));

                  return function (_x9) {
                    return _ref8.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function create(_x8) {
        return _create.apply(this, arguments);
      }

      return create;
    }()
    /**
     * Creates a query object to be used for list queries.
     * @param selector - the selector to create the query from
     * @param config - the config to use for the query
     * @return an object containing the query, relations and free-text
     *   search param.
     */

  }, {
    key: "prepareListQuery_",
    value: function prepareListQuery_(selector, config) {
      var q;

      if ("q" in selector) {
        q = selector.q;
        delete selector.q;
      }

      var query = (0, _buildQuery2.buildQuery)(selector, config);

      if (config.relations && config.relations.length > 0) {
        query.relations = config.relations;
      }

      if (config.select && config.select.length > 0) {
        query.select = config.select;
      }

      var relations = query.relations;
      delete query.relations;
      return {
        query: query,
        relations: relations,
        q: q
      };
    }
  }]);
  return ProductReviewService;
}(_medusaInterfaces.BaseService);

var _default = ProductReviewService;
exports["default"] = _default;
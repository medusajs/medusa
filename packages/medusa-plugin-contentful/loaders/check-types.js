"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var checkContentTypes = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(container) {
    var contentfulService, product, variant, productFields, keys, variantFields, _keys;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            contentfulService = container.resolve("contentfulService");
            _context.prev = 1;
            _context.next = 4;
            return contentfulService.getType("product");

          case 4:
            product = _context.sent;
            _context.next = 7;
            return contentfulService.getType("productVariant");

          case 7:
            variant = _context.sent;
            _context.next = 16;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](1);

            if (product) {
              _context.next = 14;
              break;
            }

            throw Error("Content type: `product` is missing in Contentful");

          case 14:
            if (variant) {
              _context.next = 16;
              break;
            }

            throw Error("Content type: `productVariant` is missing in Contentful");

          case 16:
            if (!(product && product.fields)) {
              _context.next = 21;
              break;
            }

            productFields = product.fields;
            keys = Object.values(productFields).map(function (f) {
              return f.id;
            });

            if (requiredProductFields.every(function (f) {
              return keys.includes(f);
            })) {
              _context.next = 21;
              break;
            }

            throw Error("Contentful: Content type ".concat("product", " is missing some required key(s). Required: ", requiredProductFields.join(", ")));

          case 21:
            if (!(variant && variant.fields)) {
              _context.next = 26;
              break;
            }

            variantFields = variant.fields;
            _keys = Object.values(variantFields).map(function (f) {
              return f.id;
            });

            if (requiredVariantFields.every(function (f) {
              return _keys.includes(f);
            })) {
              _context.next = 26;
              break;
            }

            throw Error("Contentful: Content type ".concat("productVariant", " is missing some required key(s). Required: ", requiredVariantFields.join(", ")));

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 10]]);
  }));

  return function checkContentTypes(_x) {
    return _ref.apply(this, arguments);
  };
}();

var requiredProductFields = ["title", "variants", "options", "objectId", "type", "collection", "tags", "handle"];
var requiredVariantFields = ["title", "sku", "prices", "options", "objectId"];
var _default = checkContentTypes;
exports["default"] = _default;
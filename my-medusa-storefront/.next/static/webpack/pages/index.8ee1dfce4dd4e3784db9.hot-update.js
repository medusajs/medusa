"use strict";
self["webpackHotUpdate_N_E"]("pages/index",{

/***/ "./pages/index.js":
/*!************************!*\
  !*** ./pages/index.js ***!
  \************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__N_SSG": function() { return /* binding */ __N_SSG; },
/* harmony export */   "default": function() { return /* binding */ Home; }
/* harmony export */ });
/* harmony import */ var _styles_home_module_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../styles/home.module.css */ "./styles/home.module.css");
/* harmony import */ var _styles_home_module_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_styles_home_module_css__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/link */ "./node_modules/next/link.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_icons_fa__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-icons/fa */ "./node_modules/react-icons/fa/index.esm.js");
/* harmony import */ var _utils_prices__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/prices */ "./utils/prices.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _context_store_context__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../context/store-context */ "./context/store-context.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__);
/* module decorator */ module = __webpack_require__.hmd(module);
/* provided dependency */ var process = __webpack_require__(/*! process */ "./node_modules/process/browser.js");
var _jsxFileName = "C:\\Users\\Gusta\\OneDrive\\Dokument\\GitHub\\medusa\\my-medusa-storefront\\pages\\index.js",
    _s = $RefreshSig$();








var __N_SSG = true;
function Home(_ref) {
  _s();

  var _this = this;

  var products = _ref.products;

  var _useContext = (0,react__WEBPACK_IMPORTED_MODULE_2__.useContext)(_context_store_context__WEBPACK_IMPORTED_MODULE_3__.default),
      cart = _useContext.cart;

  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
    className: (_styles_home_module_css__WEBPACK_IMPORTED_MODULE_5___default().container),
    children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("main", {
      className: (_styles_home_module_css__WEBPACK_IMPORTED_MODULE_5___default().main),
      children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: (_styles_home_module_css__WEBPACK_IMPORTED_MODULE_5___default().hero),
        children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("h1", {
          className: (_styles_home_module_css__WEBPACK_IMPORTED_MODULE_5___default().title),
          children: ["Medusa + Next.js Starter", " ", /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("span", {
            role: "img",
            "aria-label": "Rocket emoji",
            children: "\uD83D\uDE80"
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 18,
            columnNumber: 13
          }, this)]
        }, void 0, true, {
          fileName: _jsxFileName,
          lineNumber: 16,
          columnNumber: 11
        }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("p", {
          className: (_styles_home_module_css__WEBPACK_IMPORTED_MODULE_5___default().description),
          children: "Build blazing-fast LOL client applications on top of a modular headless commerce engine. Integrate seamlessly with any 3rd party tools for a best-in-breed commerce stack."
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 22,
          columnNumber: 11
        }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
          className: (_styles_home_module_css__WEBPACK_IMPORTED_MODULE_5___default().tags),
          children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
            className: (_styles_home_module_css__WEBPACK_IMPORTED_MODULE_5___default().tag),
            style: {
              background: "lightgrey"
            },
            children: ["v", process.env.NEXT_PUBLIC_APP_VERSION]
          }, void 0, true, {
            fileName: _jsxFileName,
            lineNumber: 28,
            columnNumber: 13
          }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("a", {
            href: "https://www.medusa-commerce.com/",
            arget: "_blank",
            rel: "noreferrer",
            role: "button",
            children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
              className: (_styles_home_module_css__WEBPACK_IMPORTED_MODULE_5___default().tag),
              style: {
                background: "var(--logo-color-900)",
                color: "white"
              },
              children: "Medusa"
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 37,
              columnNumber: 15
            }, this)
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 31,
            columnNumber: 13
          }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("a", {
            href: "https://nextjs.org/docs/getting-started",
            target: "_blank",
            rel: "noreferrer",
            role: "button",
            children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
              className: (_styles_home_module_css__WEBPACK_IMPORTED_MODULE_5___default().tag),
              style: {
                background: "#111111",
                color: "white"
              },
              children: "Next.js"
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 50,
              columnNumber: 15
            }, this)
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 13
          }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("a", {
            href: "https://stripe.com/docs",
            target: "_blank",
            rel: "noreferrer",
            role: "button",
            children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
              className: (_styles_home_module_css__WEBPACK_IMPORTED_MODULE_5___default().tag),
              style: {
                background: "#4379FF",
                color: "white"
              },
              children: "Stripe"
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 63,
              columnNumber: 15
            }, this)
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 57,
            columnNumber: 13
          }, this)]
        }, void 0, true, {
          fileName: _jsxFileName,
          lineNumber: 27,
          columnNumber: 11
        }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
          className: (_styles_home_module_css__WEBPACK_IMPORTED_MODULE_5___default().links),
          children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("a", {
            href: "https://docs.medusa-commerce.com/",
            target: "_blank",
            rel: "noreferrer",
            role: "button",
            className: (_styles_home_module_css__WEBPACK_IMPORTED_MODULE_5___default().btn),
            children: ["Read the docs", /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("svg", {
              stroke: "currentColor",
              fill: "currentColor",
              strokeWidth: "0",
              viewBox: "0 0 24 24",
              height: "1em",
              width: "1em",
              xmlns: "http://www.w3.org/2000/svg",
              children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("path", {
                d: "M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
              }, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 89,
                columnNumber: 17
              }, this)
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 80,
              columnNumber: 15
            }, this)]
          }, void 0, true, {
            fileName: _jsxFileName,
            lineNumber: 72,
            columnNumber: 13
          }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("a", {
            href: "https://github.com/medusajs/nextjs-starter-medusa",
            target: "_blank",
            rel: "noreferrer",
            role: "button",
            className: (_styles_home_module_css__WEBPACK_IMPORTED_MODULE_5___default().btn),
            children: ["View on GitHub", /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)(react_icons_fa__WEBPACK_IMPORTED_MODULE_6__.FaGithub, {}, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 100,
              columnNumber: 15
            }, this)]
          }, void 0, true, {
            fileName: _jsxFileName,
            lineNumber: 92,
            columnNumber: 13
          }, this)]
        }, void 0, true, {
          fileName: _jsxFileName,
          lineNumber: 71,
          columnNumber: 11
        }, this)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 15,
        columnNumber: 9
      }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
        className: (_styles_home_module_css__WEBPACK_IMPORTED_MODULE_5___default().products),
        children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("h2", {
          children: "Demo Products"
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 105,
          columnNumber: 11
        }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
          className: (_styles_home_module_css__WEBPACK_IMPORTED_MODULE_5___default().grid),
          children: products && products.map(function (p) {
            return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
              className: (_styles_home_module_css__WEBPACK_IMPORTED_MODULE_5___default().card),
              children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_0___default()), {
                href: {
                  pathname: "/product/[id]",
                  query: {
                    id: p.id
                  }
                },
                passHref: true,
                children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("a", {
                  children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("div", {
                    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("h2", {
                      children: p.title
                    }, void 0, false, {
                      fileName: _jsxFileName,
                      lineNumber: 117,
                      columnNumber: 27
                    }, _this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxDEV)("p", {
                      children: (0,_utils_prices__WEBPACK_IMPORTED_MODULE_1__.formatPrices)(cart, p.variants[0])
                    }, void 0, false, {
                      fileName: _jsxFileName,
                      lineNumber: 118,
                      columnNumber: 27
                    }, _this)]
                  }, void 0, true, {
                    fileName: _jsxFileName,
                    lineNumber: 116,
                    columnNumber: 25
                  }, _this)
                }, void 0, false, {
                  fileName: _jsxFileName,
                  lineNumber: 115,
                  columnNumber: 23
                }, _this)
              }, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 111,
                columnNumber: 21
              }, _this)
            }, p.id, false, {
              fileName: _jsxFileName,
              lineNumber: 110,
              columnNumber: 19
            }, _this);
          })
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 106,
          columnNumber: 11
        }, this)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 104,
        columnNumber: 9
      }, this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 14,
      columnNumber: 7
    }, this)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 13,
    columnNumber: 5
  }, this);
}

_s(Home, "3yaiwnc2jQzb4Qw4OxX90Kkr0sM=");

_c = Home;

var _c;

$RefreshReg$(_c, "Home");

;
    var _a, _b;
    // Legacy CSS implementations will `eval` browser code in a Node.js context
    // to extract CSS. For backwards compatibility, we need to check we're in a
    // browser context before continuing.
    if (typeof self !== 'undefined' &&
        // AMP / No-JS mode does not inject these helpers:
        '$RefreshHelpers$' in self) {
        var currentExports = module.__proto__.exports;
        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;
        // This cannot happen in MainTemplate because the exports mismatch between
        // templating and execution.
        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);
        // A module can be accepted automatically based on its exports, e.g. when
        // it is a Refresh Boundary.
        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
            // Save the previous exports on update so we can compare the boundary
            // signatures.
            module.hot.dispose(function (data) {
                data.prevExports = currentExports;
            });
            // Unconditionally accept an update to this module, we'll check if it's
            // still a Refresh Boundary later.
            module.hot.accept();
            // This field is set when the previous version of this module was a
            // Refresh Boundary, letting us know we need to check for invalidation or
            // enqueue an update.
            if (prevExports !== null) {
                // A boundary can become ineligible if its exports are incompatible
                // with the previous exports.
                //
                // For example, if you add/remove/change exports, we'll want to
                // re-execute the importing modules, and force those components to
                // re-render. Similarly, if you convert a class component to a
                // function, we want to invalidate the boundary.
                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {
                    module.hot.invalidate();
                }
                else {
                    self.$RefreshHelpers$.scheduleUpdate();
                }
            }
        }
        else {
            // Since we just executed the code for the module, it's possible that the
            // new exports made it ineligible for being a boundary.
            // We only care about the case when we were _previously_ a boundary,
            // because we already accepted this update (accidental side effect).
            var isNoLongerABoundary = prevExports !== null;
            if (isNoLongerABoundary) {
                module.hot.invalidate();
            }
        }
    }


/***/ })

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljL3dlYnBhY2svcGFnZXMvaW5kZXguOGVlMWRmY2U0ZGQ0ZTM3ODRkYjkuaG90LXVwZGF0ZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUVlLFNBQVNNLElBQVQsT0FBNEI7QUFBQTs7QUFBQTs7QUFBQSxNQUFaQyxRQUFZLFFBQVpBLFFBQVk7O0FBQ3pDLG9CQUFpQkgsaURBQVUsQ0FBQ0MsMkRBQUQsQ0FBM0I7QUFBQSxNQUFRRyxJQUFSLGVBQVFBLElBQVI7O0FBRUEsc0JBQ0U7QUFBSyxhQUFTLEVBQUVSLDBFQUFoQjtBQUFBLDJCQUNFO0FBQU0sZUFBUyxFQUFFQSxxRUFBakI7QUFBQSw4QkFDRTtBQUFLLGlCQUFTLEVBQUVBLHFFQUFoQjtBQUFBLGdDQUNFO0FBQUksbUJBQVMsRUFBRUEsc0VBQWY7QUFBQSxpREFDMkIsR0FEM0IsZUFFRTtBQUFNLGdCQUFJLEVBQUMsS0FBWDtBQUFpQiwwQkFBVyxjQUE1QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxrQkFGRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0JBREYsZUFPRTtBQUFHLG1CQUFTLEVBQUVBLDRFQUFkO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGdCQVBGLGVBWUU7QUFBSyxtQkFBUyxFQUFFQSxxRUFBaEI7QUFBQSxrQ0FDRTtBQUFLLHFCQUFTLEVBQUVBLG9FQUFoQjtBQUE0QixpQkFBSyxFQUFFO0FBQUVnQixjQUFBQSxVQUFVLEVBQUU7QUFBZCxhQUFuQztBQUFBLDRCQUNJQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsdUJBRGhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxrQkFERixlQUlFO0FBQ0UsZ0JBQUksRUFBQyxrQ0FEUDtBQUVFLGlCQUFLLEVBQUMsUUFGUjtBQUdFLGVBQUcsRUFBQyxZQUhOO0FBSUUsZ0JBQUksRUFBQyxRQUpQO0FBQUEsbUNB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NENBQ0U7QUFBQSxnQ0FBS0osQ0FBQyxDQUFDYjtBQUFQO0FBQUE7QUFBQTtBQUFBO0FBQUEsNkJBREYsZUFFRTtBQUFBLGdDQUFJVCwyREFBWSxDQUFDSyxJQUFELEVBQU9pQixDQUFDLENBQUNLLFFBQUYsQ0FBVyxDQUFYLENBQVA7QUFBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQSw2QkFGRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFERjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSkY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURGLGVBQVVMLENBQUMsQ0FBQ0ksRUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQURGO0FBZUQsV0FoQkQ7QUFGSjtBQUFBO0FBQUE7QUFBQTtBQUFBLGdCQUZGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxjQTFGRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFERjtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBREY7QUFzSEQ7O0dBekh1QnZCOztLQUFBQSIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9wYWdlcy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc3R5bGVzIGZyb20gXCIuLi9zdHlsZXMvaG9tZS5tb2R1bGUuY3NzXCI7XG5pbXBvcnQgTGluayBmcm9tIFwibmV4dC9saW5rXCI7XG5pbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tIFwiLi4vdXRpbHMvY2xpZW50XCI7XG5pbXBvcnQgeyBGYUdpdGh1YiB9IGZyb20gXCJyZWFjdC1pY29ucy9mYVwiO1xuaW1wb3J0IHsgZm9ybWF0UHJpY2VzIH0gZnJvbSBcIi4uL3V0aWxzL3ByaWNlc1wiO1xuaW1wb3J0IHsgdXNlQ29udGV4dCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IFN0b3JlQ29udGV4dCBmcm9tIFwiLi4vY29udGV4dC9zdG9yZS1jb250ZXh0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEhvbWUoeyBwcm9kdWN0cyB9KSB7XG4gIGNvbnN0IHsgY2FydCB9ID0gdXNlQ29udGV4dChTdG9yZUNvbnRleHQpXG4gIFxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMuY29udGFpbmVyfT5cbiAgICAgIDxtYWluIGNsYXNzTmFtZT17c3R5bGVzLm1haW59PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17c3R5bGVzLmhlcm99PlxuICAgICAgICAgIDxoMSBjbGFzc05hbWU9e3N0eWxlcy50aXRsZX0+XG4gICAgICAgICAgICBNZWR1c2EgKyBOZXh0LmpzIFN0YXJ0ZXJ7XCIgXCJ9XG4gICAgICAgICAgICA8c3BhbiByb2xlPVwiaW1nXCIgYXJpYS1sYWJlbD1cIlJvY2tldCBlbW9qaVwiPlxuICAgICAgICAgICAgICDwn5qAXG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9oMT5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9e3N0eWxlcy5kZXNjcmlwdGlvbn0+XG4gICAgICAgICAgICBCdWlsZCBibGF6aW5nLWZhc3QgTE9MIGNsaWVudCBhcHBsaWNhdGlvbnMgb24gdG9wIG9mIGEgbW9kdWxhciBoZWFkbGVzc1xuICAgICAgICAgICAgY29tbWVyY2UgZW5naW5lLiBJbnRlZ3JhdGUgc2VhbWxlc3NseSB3aXRoIGFueSAzcmQgcGFydHkgdG9vbHMgZm9yIGFcbiAgICAgICAgICAgIGJlc3QtaW4tYnJlZWQgY29tbWVyY2Ugc3RhY2suXG4gICAgICAgICAgPC9wPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMudGFnc30+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17c3R5bGVzLnRhZ30gc3R5bGU9e3sgYmFja2dyb3VuZDogXCJsaWdodGdyZXlcIiB9fT5cbiAgICAgICAgICAgICAgdntwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19BUFBfVkVSU0lPTn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgaHJlZj1cImh0dHBzOi8vd3d3Lm1lZHVzYS1jb21tZXJjZS5jb20vXCJcbiAgICAgICAgICAgICAgYXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICAgICAgICByZWw9XCJub3JlZmVycmVyXCJcbiAgICAgICAgICAgICAgcm9sZT1cImJ1dHRvblwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e3N0eWxlcy50YWd9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgYmFja2dyb3VuZDogXCJ2YXIoLS1sb2dvLWNvbG9yLTkwMClcIiwgY29sb3I6IFwid2hpdGVcIiB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgTWVkdXNhXG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgaHJlZj1cImh0dHBzOi8vbmV4dGpzLm9yZy9kb2NzL2dldHRpbmctc3RhcnRlZFwiXG4gICAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXG4gICAgICAgICAgICAgIHJlbD1cIm5vcmVmZXJyZXJcIlxuICAgICAgICAgICAgICByb2xlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17c3R5bGVzLnRhZ31cbiAgICAgICAgICAgICAgICBzdHlsZT17eyBiYWNrZ3JvdW5kOiBcIiMxMTExMTFcIiwgY29sb3I6IFwid2hpdGVcIiB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgTmV4dC5qc1xuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgIGhyZWY9XCJodHRwczovL3N0cmlwZS5jb20vZG9jc1wiXG4gICAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXG4gICAgICAgICAgICAgIHJlbD1cIm5vcmVmZXJyZXJcIlxuICAgICAgICAgICAgICByb2xlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17c3R5bGVzLnRhZ31cbiAgICAgICAgICAgICAgICBzdHlsZT17eyBiYWNrZ3JvdW5kOiBcIiM0Mzc5RkZcIiwgY29sb3I6IFwid2hpdGVcIiB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgU3RyaXBlXG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMubGlua3N9PlxuICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgaHJlZj1cImh0dHBzOi8vZG9jcy5tZWR1c2EtY29tbWVyY2UuY29tL1wiXG4gICAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXG4gICAgICAgICAgICAgIHJlbD1cIm5vcmVmZXJyZXJcIlxuICAgICAgICAgICAgICByb2xlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtzdHlsZXMuYnRufVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBSZWFkIHRoZSBkb2NzXG4gICAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgIGZpbGw9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoPVwiMFwiXG4gICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICAgICAgICAgICAgaGVpZ2h0PVwiMWVtXCJcbiAgICAgICAgICAgICAgICB3aWR0aD1cIjFlbVwiXG4gICAgICAgICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEyIDRsLTEuNDEgMS40MUwxNi4xNyAxMUg0djJoMTIuMTdsLTUuNTggNS41OUwxMiAyMGw4LTh6XCI+PC9wYXRoPlxuICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vbWVkdXNhanMvbmV4dGpzLXN0YXJ0ZXItbWVkdXNhXCJcbiAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcbiAgICAgICAgICAgICAgcmVsPVwibm9yZWZlcnJlclwiXG4gICAgICAgICAgICAgIHJvbGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9e3N0eWxlcy5idG59XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIFZpZXcgb24gR2l0SHViXG4gICAgICAgICAgICAgIDxGYUdpdGh1YiAvPlxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e3N0eWxlcy5wcm9kdWN0c30+XG4gICAgICAgICAgPGgyPkRlbW8gUHJvZHVjdHM8L2gyPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtzdHlsZXMuZ3JpZH0+XG4gICAgICAgICAgICB7cHJvZHVjdHMgJiZcbiAgICAgICAgICAgICAgcHJvZHVjdHMubWFwKChwKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtwLmlkfSBjbGFzc05hbWU9e3N0eWxlcy5jYXJkfT5cbiAgICAgICAgICAgICAgICAgICAgPExpbmtcbiAgICAgICAgICAgICAgICAgICAgICBocmVmPXt7IHBhdGhuYW1lOiBgL3Byb2R1Y3QvW2lkXWAsIHF1ZXJ5OiB7IGlkOiBwLmlkIH0gfX1cbiAgICAgICAgICAgICAgICAgICAgICBwYXNzSHJlZlxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPGE+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8aDI+e3AudGl0bGV9PC9oMj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+e2Zvcm1hdFByaWNlcyhjYXJ0LCBwLnZhcmlhbnRzWzBdKX08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvbWFpbj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGNvbnN0IGdldFN0YXRpY1Byb3BzID0gYXN5bmMgKCkgPT4ge1xuICBjb25zdCBjbGllbnQgPSBjcmVhdGVDbGllbnQoKTtcbiAgY29uc3QgeyBwcm9kdWN0cyB9ID0gYXdhaXQgY2xpZW50LnByb2R1Y3RzLmxpc3QoKTtcblxuICByZXR1cm4ge1xuICAgIHByb3BzOiB7XG4gICAgICBwcm9kdWN0cyxcbiAgICB9LFxuICB9O1xufTtcbiJdLCJuYW1lcyI6WyJzdHlsZXMiLCJMaW5rIiwiRmFHaXRodWIiLCJmb3JtYXRQcmljZXMiLCJ1c2VDb250ZXh0IiwiU3RvcmVDb250ZXh0IiwiSG9tZSIsInByb2R1Y3RzIiwiY2FydCIsImNvbnRhaW5lciIsIm1haW4iLCJoZXJvIiwidGl0bGUiLCJkZXNjcmlwdGlvbiIsInRhZ3MiLCJ0YWciLCJiYWNrZ3JvdW5kIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX0FQUF9WRVJTSU9OIiwiY29sb3IiLCJsaW5rcyIsImJ0biIsImdyaWQiLCJtYXAiLCJwIiwiY2FyZCIsInBhdGhuYW1lIiwicXVlcnkiLCJpZCIsInZhcmlhbnRzIl0sInNvdXJjZVJvb3QiOiIifQ==
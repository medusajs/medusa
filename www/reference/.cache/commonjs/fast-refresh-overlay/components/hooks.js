"use strict";

exports.__esModule = true;
exports.useStackFrame = useStackFrame;

var React = _interopRequireWildcard(require("react"));

var _utils = require("../utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const initialResponse = {
  decoded: null,
  sourcePosition: {
    line: null,
    number: null
  },
  sourceContent: null
};

function useStackFrame({
  moduleId,
  lineNumber,
  columnNumber
}) {
  const url = `/__original-stack-frame?moduleId=` + window.encodeURIComponent(moduleId) + `&lineNumber=` + window.encodeURIComponent(lineNumber) + `&columnNumber=` + window.encodeURIComponent(columnNumber);
  const [response, setResponse] = React.useState(initialResponse);
  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(url);
        const json = await res.json();
        const decoded = (0, _utils.prettifyStack)(json.codeFrame);
        const {
          sourcePosition,
          sourceContent
        } = json;
        setResponse({
          decoded,
          sourceContent,
          sourcePosition
        });
      } catch (err) {
        setResponse({ ...initialResponse,
          decoded: (0, _utils.prettifyStack)(err.message)
        });
      }
    }

    fetchData();
  }, []);
  return response;
}
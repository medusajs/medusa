"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setContext = void 0;
var Aliases;
(function (Aliases) {
    Aliases["Context"] = "context";
})(Aliases || (Aliases = {}));
async function setContext({ data, }) {
    const contextDTO = {
        context: data[Aliases.Context].context,
    };
    return contextDTO;
}
exports.setContext = setContext;
setContext.aliases = Aliases;

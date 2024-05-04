"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToggleState = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const useToggleState = (initial = false) => {
    const [state, setState] = React.useState(initial);
    const close = () => {
        setState(false);
    };
    const open = () => {
        setState(true);
    };
    const toggle = () => {
        setState((state) => !state);
    };
    const hookData = [state, open, close, toggle];
    hookData.state = state;
    hookData.open = open;
    hookData.close = close;
    hookData.toggle = toggle;
    return hookData;
};
exports.useToggleState = useToggleState;
//# sourceMappingURL=use-toggle-state.js.map
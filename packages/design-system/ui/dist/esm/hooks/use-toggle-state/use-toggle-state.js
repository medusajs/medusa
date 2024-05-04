"use client";
import * as React from "react";
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
export { useToggleState };
//# sourceMappingURL=use-toggle-state.js.map
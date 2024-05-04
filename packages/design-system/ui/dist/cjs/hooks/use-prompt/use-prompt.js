"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePrompt = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const client_1 = require("react-dom/client");
const render_prompt_1 = require("./render-prompt");
const usePrompt = () => {
    const prompt = async (props) => {
        return new Promise((resolve) => {
            let open = true;
            const onCancel = () => {
                open = false;
                render();
                resolve(false);
            };
            const onConfirm = () => {
                open = false;
                resolve(true);
                render();
            };
            const mountRoot = (0, client_1.createRoot)(document.createElement("div"));
            const render = () => {
                mountRoot.render(React.createElement(render_prompt_1.RenderPrompt, { open: open, onConfirm: onConfirm, onCancel: onCancel, ...props }));
            };
            render();
        });
    };
    return prompt;
};
exports.usePrompt = usePrompt;
//# sourceMappingURL=use-prompt.js.map
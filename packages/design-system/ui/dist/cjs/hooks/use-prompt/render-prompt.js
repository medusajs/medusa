"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderPrompt = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const input_1 = require("../../components/input");
const label_1 = require("../../components/label");
const prompt_1 = require("../../components/prompt");
const RenderPrompt = ({ 
/**
 * @ignore
 */
open, 
/**
 * The variant of the prompt.
 */
variant = "danger", 
/**
 * The prompt's title.
 */
title, 
/**
 * The prompt's description.
 */
description, 
/**
 * The text the user has to input in order to confirm the action.
 */
verificationText, 
/**
 * The instruction for the verification text. Useful for passing a translated string to use instead of the default english one.
 * Should be in the format: "Please type {val} to confirm:"
 */
verificationInstruction = "Please type {val} to confirm:", 
/**
 * The label for the Cancel button.
 */
cancelText = "Cancel", 
/**
 * Label for the Confirm button.
 */
confirmText = "Confirm", 
/**
 * @ignore
 */
onConfirm, 
/**
 * @ignore
 */
onCancel, }) => {
    const [userInput, setUserInput] = React.useState("");
    const handleUserInput = (event) => {
        setUserInput(event.target.value);
    };
    const validInput = React.useMemo(() => {
        if (!verificationText) {
            return true;
        }
        return userInput === verificationText;
    }, [userInput, verificationText]);
    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (!verificationText) {
            return;
        }
        if (validInput) {
            onConfirm();
        }
    };
    React.useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape" && open) {
                onCancel();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [onCancel, open]);
    let instructionParts = verificationInstruction.includes("{val}")
        ? verificationInstruction.split("{val}")
        : ["Please type", "to confirm:"];
    if (instructionParts.length !== 2) {
        instructionParts = ["Please type", "to confirm:"];
    }
    return (React.createElement(prompt_1.Prompt, { open: open, variant: variant },
        React.createElement(prompt_1.Prompt.Content, null,
            React.createElement("form", { onSubmit: handleFormSubmit },
                React.createElement(prompt_1.Prompt.Header, null,
                    React.createElement(prompt_1.Prompt.Title, null, title),
                    React.createElement(prompt_1.Prompt.Description, null, description)),
                verificationText && (React.createElement("div", { className: "border-ui-border-base mt-6 flex flex-col gap-y-4 border-y p-6" },
                    React.createElement(label_1.Label, { htmlFor: "verificationText", className: "text-ui-fg-subtle" },
                        instructionParts[0],
                        " ",
                        React.createElement("span", { className: "text-ui-fg-base txt-compact-medium-plus" }, verificationText),
                        " ",
                        instructionParts[1]),
                    React.createElement(input_1.Input, { autoFocus: true, autoComplete: "off", id: "verificationText", placeholder: verificationText, onChange: handleUserInput }))),
                React.createElement(prompt_1.Prompt.Footer, null,
                    React.createElement(prompt_1.Prompt.Cancel, { onClick: onCancel }, cancelText),
                    React.createElement(prompt_1.Prompt.Action, { disabled: !validInput, type: verificationText ? "submit" : "button", onClick: verificationText ? undefined : onConfirm }, confirmText))))));
};
exports.RenderPrompt = RenderPrompt;
exports.RenderPrompt.displayName = "RenderPrompt";
//# sourceMappingURL=render-prompt.js.map
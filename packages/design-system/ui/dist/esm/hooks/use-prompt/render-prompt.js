"use client";
import * as React from "react";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import { Prompt } from "../../components/prompt";
export const RenderPrompt = ({ 
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
    return (React.createElement(Prompt, { open: open, variant: variant },
        React.createElement(Prompt.Content, null,
            React.createElement("form", { onSubmit: handleFormSubmit },
                React.createElement(Prompt.Header, null,
                    React.createElement(Prompt.Title, null, title),
                    React.createElement(Prompt.Description, null, description)),
                verificationText && (React.createElement("div", { className: "border-ui-border-base mt-6 flex flex-col gap-y-4 border-y p-6" },
                    React.createElement(Label, { htmlFor: "verificationText", className: "text-ui-fg-subtle" },
                        instructionParts[0],
                        " ",
                        React.createElement("span", { className: "text-ui-fg-base txt-compact-medium-plus" }, verificationText),
                        " ",
                        instructionParts[1]),
                    React.createElement(Input, { autoFocus: true, autoComplete: "off", id: "verificationText", placeholder: verificationText, onChange: handleUserInput }))),
                React.createElement(Prompt.Footer, null,
                    React.createElement(Prompt.Cancel, { onClick: onCancel }, cancelText),
                    React.createElement(Prompt.Action, { disabled: !validInput, type: verificationText ? "submit" : "button", onClick: verificationText ? undefined : onConfirm }, confirmText))))));
};
RenderPrompt.displayName = "RenderPrompt";
//# sourceMappingURL=render-prompt.js.map
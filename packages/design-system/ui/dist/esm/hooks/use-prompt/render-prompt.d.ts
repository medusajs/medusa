import * as React from "react";
export interface RenderPromptProps {
    open: boolean;
    title: string;
    description: string;
    variant?: "danger" | "confirmation";
    verificationText?: string;
    verificationInstruction?: string;
    cancelText?: string;
    confirmText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}
export declare const RenderPrompt: {
    ({ open, variant, title, description, verificationText, verificationInstruction, cancelText, confirmText, onConfirm, onCancel, }: RenderPromptProps): React.JSX.Element;
    displayName: string;
};

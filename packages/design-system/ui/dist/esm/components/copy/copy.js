"use client";
import { Tooltip } from "../tooltip";
import { clx } from "../../utils/clx";
import { CheckCircleMiniSolid, CheckCircleSolid, SquareTwoStack, SquareTwoStackMini, } from "@medusajs/icons";
import { Slot } from "@radix-ui/react-slot";
import copy from "copy-to-clipboard";
import React, { useState } from "react";
/**
 * This component is based on the `button` element and supports all of its props
 */
const Copy = React.forwardRef(({ children, className, 
/**
 * The content to copy.
 */
content, 
/**
 * The variant of the copy button.
 */
variant = "default", 
/**
 * Whether to remove the wrapper `button` element and use the
 * passed child element instead.
 */
asChild = false, ...props }, ref) => {
    const [done, setDone] = useState(false);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("Copy");
    const copyToClipboard = (e) => {
        e.stopPropagation();
        setDone(true);
        copy(content);
        setTimeout(() => {
            setDone(false);
        }, 2000);
    };
    React.useEffect(() => {
        if (done) {
            setText("Copied");
            return;
        }
        setTimeout(() => {
            setText("Copy");
        }, 500);
    }, [done]);
    const isDefaultVariant = (variant) => {
        return variant === "default";
    };
    const isDefault = isDefaultVariant(variant);
    const Component = asChild ? Slot : "button";
    return (React.createElement(Tooltip, { content: text, open: done || open, onOpenChange: setOpen },
        React.createElement(Component, { ref: ref, "aria-label": "Copy code snippet", type: "button", className: clx("text-ui-code-icon h-fit w-fit", className), onClick: copyToClipboard, ...props }, children ? (children) : done ? (isDefault ? (React.createElement(CheckCircleSolid, null)) : (React.createElement(CheckCircleMiniSolid, null))) : isDefault ? (React.createElement(SquareTwoStack, null)) : (React.createElement(SquareTwoStackMini, null)))));
});
Copy.displayName = "Copy";
export { Copy };
//# sourceMappingURL=copy.js.map
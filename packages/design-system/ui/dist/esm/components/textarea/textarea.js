import * as React from "react";
import { clx } from "../../utils/clx";
import { inputBaseStyles } from "../input";
/**
 * This component is based on the `textarea` element and supports all of its props
 */
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement("textarea", { ref: ref, className: clx(inputBaseStyles, "txt-small min-h-[60px] w-full px-2 py-1.5", className), ...props }));
});
Textarea.displayName = "Textarea";
export { Textarea };
//# sourceMappingURL=textarea.js.map
import { clx } from "../../utils/clx";
import * as React from "react";
/**
 * This component is based on the `code` element and supports all of its props
 */
const Code = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement("code", { ref: ref, className: clx("border-ui-tag-neutral-border bg-ui-tag-neutral-bg text-ui-tag-neutral-text txt-compact-small inline-flex rounded-md border px-[6px] font-mono", className), ...props }));
});
Code.displayName = "Code";
export { Code };
//# sourceMappingURL=code.js.map
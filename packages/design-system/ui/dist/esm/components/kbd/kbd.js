import * as React from "react";
import { clx } from "../../utils/clx";
/**
 * This component is based on the `kbd` element and supports all of its props
 */
const Kbd = React.forwardRef(({ children, className, ...props }, ref) => {
    return (React.createElement("kbd", { ...props, ref: ref, className: clx("bg-ui-tag-neutral-bg text-ui-tag-neutral-text border-ui-tag-neutral-border inline-flex h-5 w-fit min-w-[20px] items-center justify-center rounded-md border px-1", "txt-compact-xsmall-plus", className) }, children));
});
Kbd.displayName = "Kbd";
export { Kbd };
//# sourceMappingURL=kbd.js.map
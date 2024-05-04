import * as React from "react";
import { clx } from "../../utils/clx";
/**
 * This component is based on the `div` element and supports all of its props
 */
const Container = React.forwardRef(({ className, ...props }, ref) => {
    return (React.createElement("div", { ref: ref, className: clx("shadow-elevation-card-rest bg-ui-bg-base w-full rounded-lg px-8 pb-8 pt-6", className), ...props }));
});
Container.displayName = "Container";
export { Container };
//# sourceMappingURL=container.js.map
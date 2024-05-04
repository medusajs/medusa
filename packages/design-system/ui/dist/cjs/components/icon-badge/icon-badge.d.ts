import { type VariantProps } from "cva";
import * as React from "react";
import { badgeColorVariants } from "../badge";
declare const iconBadgeVariants: (props?: ({
    size?: "base" | "large" | undefined;
} & ({
    class?: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | any | {
        [x: string]: any;
    } | null | undefined)[] | {
        [x: string]: any;
    } | null | undefined)[] | {
        [x: string]: any;
    } | null | undefined)[] | {
        [x: string]: any;
    } | null | undefined)[] | {
        [x: string]: any;
    } | null | undefined)[] | {
        [x: string]: any;
    } | null | undefined)[] | {
        [x: string]: any;
    } | null | undefined)[] | {
        [x: string]: any;
    } | null | undefined)[] | {
        [x: string]: any;
    } | null | undefined)[] | {
        [x: string]: any;
    } | null | undefined)[] | {
        [x: string]: any;
    } | null | undefined)[] | {
        [x: string]: any;
    } | null | undefined;
    className?: undefined;
} | {
    class?: undefined;
    className?: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | any | {
        [x: string]: any;
    } | null | undefined)[] | {
        [x: string]: any;
    } | null | undefined)[] | {
        [x: string]: any;
    } | null | undefined)[] | {
        [x: string]: any;
    } | null | undefined)[] | {
        [x: string]: any;
    } | null | undefined)[] | {
        [x: string]: any;
    } | null | undefined)[] | {
        [x: string]: any;
    } | null | undefined)[] | {
        [x: string]: any;
    } | null | undefined)[] | {
        [x: string]: any;
    } | null | undefined)[] | {
        [x: string]: any;
    } | null | undefined)[] | {
        [x: string]: any;
    } | null | undefined)[] | {
        [x: string]: any;
    } | null | undefined;
})) | undefined) => string;
interface IconBadgeProps extends Omit<React.ComponentPropsWithoutRef<"span">, "color">, VariantProps<typeof badgeColorVariants>, VariantProps<typeof iconBadgeVariants> {
    asChild?: boolean;
}
/**
 * This component is based on the `span` element and supports all of its props
 */
declare const IconBadge: React.ForwardRefExoticComponent<IconBadgeProps & React.RefAttributes<HTMLSpanElement>>;
export { IconBadge };

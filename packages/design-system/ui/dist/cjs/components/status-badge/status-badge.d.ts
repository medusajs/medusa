import * as React from "react";
import { VariantProps } from "cva";
declare const statusBadgeVariants: (props?: ({
    color?: "green" | "red" | "blue" | "orange" | "grey" | "purple" | undefined;
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
interface StatusBadgeProps extends Omit<React.ComponentPropsWithoutRef<"span">, "color">, VariantProps<typeof statusBadgeVariants> {
}
/**
 * This component is based on the span element and supports all of its props
 */
declare const StatusBadge: React.ForwardRefExoticComponent<StatusBadgeProps & React.RefAttributes<HTMLSpanElement>>;
export { StatusBadge };

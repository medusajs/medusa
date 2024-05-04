import { VariantProps } from "cva";
import * as React from "react";
declare const inputBaseStyles: string;
declare const inputVariants: (props?: ({
    size?: "small" | "base" | undefined;
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
interface InputProps extends VariantProps<typeof inputVariants>, Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
}
/**
 * This component is based on the `input` element and supports all of its props
 */
declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export { Input, inputBaseStyles };

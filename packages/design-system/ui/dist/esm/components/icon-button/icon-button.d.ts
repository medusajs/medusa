import { VariantProps } from "cva";
import * as React from "react";
declare const iconButtonVariants: (props?: ({
    variant?: "primary" | "transparent" | undefined;
    size?: "2xsmall" | "xsmall" | "small" | "base" | "large" | "xlarge" | undefined;
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
interface IconButtonProps extends React.ComponentPropsWithoutRef<"button">, VariantProps<typeof iconButtonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
}
/**
 * This component is based on the `button` element and supports all of its props
 */
declare const IconButton: React.ForwardRefExoticComponent<IconButtonProps & React.RefAttributes<HTMLButtonElement>>;
export { IconButton, iconButtonVariants };

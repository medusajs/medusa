import * as Primitives from "@radix-ui/react-popover";
import * as React from "react";
/**
 * This component is based on the [Radix UI Popover](https://www.radix-ui.com/primitives/docs/components/popover) primitves.
 */
declare const Root: {
    (props: React.ComponentPropsWithoutRef<typeof Primitives.Root>): React.JSX.Element;
    displayName: string;
};
interface ContentProps extends React.ComponentPropsWithoutRef<typeof Primitives.Content> {
}
declare const Popover: {
    (props: React.ComponentPropsWithoutRef<typeof Primitives.Root>): React.JSX.Element;
    displayName: string;
} & {
    Trigger: React.ForwardRefExoticComponent<Omit<Primitives.PopoverTriggerProps & React.RefAttributes<HTMLButtonElement>, "ref"> & React.RefAttributes<HTMLButtonElement>>;
    Anchor: React.ForwardRefExoticComponent<Omit<Primitives.PopoverAnchorProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    Close: React.ForwardRefExoticComponent<Omit<Primitives.PopoverCloseProps & React.RefAttributes<HTMLButtonElement>, "ref"> & React.RefAttributes<HTMLButtonElement>>;
    Content: React.ForwardRefExoticComponent<ContentProps & React.RefAttributes<HTMLDivElement>>;
    Seperator: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
};
export { Popover };

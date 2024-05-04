import * as React from "react";
interface CommandBarProps extends React.PropsWithChildren {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultOpen?: boolean;
    disableAutoFocus?: boolean;
}
interface CommandProps extends Omit<React.ComponentPropsWithoutRef<"button">, "children" | "onClick"> {
    action: () => void | Promise<void>;
    label: string;
    shortcut: string;
}
declare const CommandBar: {
    ({ open, onOpenChange, defaultOpen, disableAutoFocus, children, }: CommandBarProps): React.JSX.Element;
    displayName: string;
} & {
    Command: React.ForwardRefExoticComponent<CommandProps & React.RefAttributes<HTMLButtonElement>>;
    Value: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    Bar: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    Seperator: React.ForwardRefExoticComponent<Omit<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref">, "children"> & React.RefAttributes<HTMLDivElement>>;
};
export { CommandBar };

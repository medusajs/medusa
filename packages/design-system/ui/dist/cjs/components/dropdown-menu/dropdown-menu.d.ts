import * as Primitives from "@radix-ui/react-dropdown-menu";
import * as React from "react";
declare const DropdownMenu: React.FC<Primitives.DropdownMenuProps> & {
    Trigger: React.ForwardRefExoticComponent<Primitives.DropdownMenuTriggerProps & React.RefAttributes<HTMLButtonElement>>;
    Group: React.ForwardRefExoticComponent<Primitives.DropdownMenuGroupProps & React.RefAttributes<HTMLDivElement>>;
    SubMenu: React.FC<Primitives.DropdownMenuSubProps>;
    SubMenuContent: React.ForwardRefExoticComponent<Omit<Primitives.DropdownMenuSubContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    SubMenuTrigger: React.ForwardRefExoticComponent<Omit<Primitives.DropdownMenuSubTriggerProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    Content: React.ForwardRefExoticComponent<Omit<Primitives.DropdownMenuContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    Item: React.ForwardRefExoticComponent<Omit<Primitives.DropdownMenuItemProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    CheckboxItem: React.ForwardRefExoticComponent<Omit<Primitives.DropdownMenuCheckboxItemProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    RadioGroup: React.ForwardRefExoticComponent<Primitives.DropdownMenuRadioGroupProps & React.RefAttributes<HTMLDivElement>>;
    RadioItem: React.ForwardRefExoticComponent<Omit<Primitives.DropdownMenuRadioItemProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    Label: React.ForwardRefExoticComponent<Omit<Primitives.DropdownMenuLabelProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    Separator: React.ForwardRefExoticComponent<Omit<Primitives.DropdownMenuSeparatorProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    Shortcut: {
        ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>): React.JSX.Element;
        displayName: string;
    };
    Hint: {
        ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>): React.JSX.Element;
        displayName: string;
    };
};
export { DropdownMenu };

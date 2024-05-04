import * as Primitives from "@radix-ui/react-alert-dialog";
import * as React from "react";
type PromptVariant = "danger" | "confirmation";
/**
 * This component is based on the [Radix UI Alert Dialog](https://www.radix-ui.com/primitives/docs/components/alert-dialog) primitives.
 */
declare const Root: {
    ({ variant, ...props }: Primitives.AlertDialogProps & {
        variant?: PromptVariant | undefined;
    }): React.JSX.Element;
    displayName: string;
};
declare const Prompt: {
    ({ variant, ...props }: Primitives.AlertDialogProps & {
        variant?: PromptVariant | undefined;
    }): React.JSX.Element;
    displayName: string;
} & {
    Trigger: React.ForwardRefExoticComponent<Primitives.AlertDialogTriggerProps & React.RefAttributes<HTMLButtonElement>>;
    Content: React.ForwardRefExoticComponent<Omit<Primitives.AlertDialogContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    Title: React.ForwardRefExoticComponent<Omit<Omit<Primitives.AlertDialogTitleProps & React.RefAttributes<HTMLHeadingElement>, "ref">, "asChild"> & React.RefAttributes<HTMLHeadingElement>>;
    Description: React.ForwardRefExoticComponent<Omit<Primitives.AlertDialogDescriptionProps & React.RefAttributes<HTMLParagraphElement>, "ref"> & React.RefAttributes<HTMLParagraphElement>>;
    Action: React.ForwardRefExoticComponent<Omit<Omit<Primitives.AlertDialogActionProps & React.RefAttributes<HTMLButtonElement>, "ref">, "asChild"> & React.RefAttributes<HTMLButtonElement>>;
    Cancel: React.ForwardRefExoticComponent<Omit<Omit<Primitives.AlertDialogCancelProps & React.RefAttributes<HTMLButtonElement>, "ref">, "asChild"> & React.RefAttributes<HTMLButtonElement>>;
    Header: {
        ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element;
        displayName: string;
    };
    Footer: {
        ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element;
        displayName: string;
    };
};
export { Prompt };

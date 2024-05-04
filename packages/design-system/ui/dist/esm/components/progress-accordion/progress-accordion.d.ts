import * as Primitves from "@radix-ui/react-accordion";
import * as React from "react";
import { ProgressStatus } from "../../types";
/**
 * This component is based on the [Radix UI Accordion](https://radix-ui.com/primitives/docs/components/accordion) primitves.
 */
declare const Root: {
    (props: React.ComponentPropsWithoutRef<typeof Primitves.Root>): React.JSX.Element;
    displayName: string;
};
interface HeaderProps extends React.ComponentPropsWithoutRef<typeof Primitves.Header> {
    status?: ProgressStatus;
}
declare const ProgressAccordion: {
    (props: React.ComponentPropsWithoutRef<typeof Primitves.Root>): React.JSX.Element;
    displayName: string;
} & {
    Item: React.ForwardRefExoticComponent<Omit<Primitves.AccordionItemProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    Header: React.ForwardRefExoticComponent<HeaderProps & React.RefAttributes<HTMLHeadingElement>>;
    Content: React.ForwardRefExoticComponent<Omit<Primitves.AccordionContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
};
export { ProgressAccordion };

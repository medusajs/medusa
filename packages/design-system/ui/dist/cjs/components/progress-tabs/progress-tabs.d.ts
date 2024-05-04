import * as ProgressTabsPrimitives from "@radix-ui/react-tabs";
import * as React from "react";
import { ProgressStatus } from "../../types";
interface ProgressTabsTriggerProps extends Omit<React.ComponentPropsWithoutRef<typeof ProgressTabsPrimitives.Trigger>, "asChild"> {
    status?: ProgressStatus;
}
declare const ProgressTabs: {
    (props: ProgressTabsPrimitives.TabsProps): React.JSX.Element;
    displayName: string;
} & {
    Trigger: React.ForwardRefExoticComponent<ProgressTabsTriggerProps & React.RefAttributes<HTMLButtonElement>>;
    List: React.ForwardRefExoticComponent<Omit<ProgressTabsPrimitives.TabsListProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    Content: React.ForwardRefExoticComponent<Omit<ProgressTabsPrimitives.TabsContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
};
export { ProgressTabs };

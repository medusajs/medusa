import * as TabsPrimitives from "@radix-ui/react-tabs";
import * as React from "react";
declare const Tabs: {
    (props: React.ComponentPropsWithoutRef<typeof TabsPrimitives.Root>): React.JSX.Element;
    displayName: string;
} & {
    Trigger: React.ForwardRefExoticComponent<Omit<TabsPrimitives.TabsTriggerProps & React.RefAttributes<HTMLButtonElement>, "ref"> & React.RefAttributes<HTMLButtonElement>>;
    List: React.ForwardRefExoticComponent<Omit<TabsPrimitives.TabsListProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
    Content: React.ForwardRefExoticComponent<Omit<TabsPrimitives.TabsContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
};
export { Tabs };

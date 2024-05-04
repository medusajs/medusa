import * as Primitives from "@radix-ui/react-radio-group";
import * as React from "react";
interface ChoiceBoxProps extends React.ComponentPropsWithoutRef<typeof Primitives.Item> {
    label: string;
    description: string;
}
declare const RadioGroup: React.ForwardRefExoticComponent<Omit<Primitives.RadioGroupProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>> & {
    Item: React.ForwardRefExoticComponent<Omit<Primitives.RadioGroupItemProps & React.RefAttributes<HTMLButtonElement>, "ref"> & React.RefAttributes<HTMLButtonElement>>;
    ChoiceBox: React.ForwardRefExoticComponent<ChoiceBoxProps & React.RefAttributes<HTMLButtonElement>>;
};
export { RadioGroup };

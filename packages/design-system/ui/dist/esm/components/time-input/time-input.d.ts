import { AriaTimeFieldProps, TimeValue } from "@react-aria/datepicker";
import * as React from "react";
type TimeInputProps = Omit<AriaTimeFieldProps<TimeValue>, "label" | "shouldForceLeadingZeros" | "description" | "errorMessage">;
/**
 * This component is based on the `div` element and supports all of its props.
 */
declare const TimeInput: React.ForwardRefExoticComponent<TimeInputProps & React.RefAttributes<HTMLDivElement>>;
export { TimeInput };

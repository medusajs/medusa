import { ComponentProps } from "react"
import { GroupBase } from "react-select"

export type SelectSize = "sm" | "md"

type SelectComponent = "control" | "inner_control" | "menu"

type SelectComponentStyles = Partial<
  Record<SelectComponent, ComponentProps<"div">["className"]>
>

declare module "react-select/dist/declarations/src/Select" {
  export interface Props<
    Option,
    IsMulti extends boolean,
    Group extends GroupBase<Option>
  > {
    /**
     * An optional label to display above the select.
     *
     * @defaultValue `undefined`
     */
    label?: string
    /**
     * An optional flag to indicate if the select is required.
     * If set to `true`, an asterisk will be displayed next to the label.
     *
     * @defaultValue `false`
     */
    required?: boolean
    /**
     * An optional string to display when multiple options are selected in a Select where isMulti is true.
     *
     * @defaultValue `undefined`
     */
    selectedPlaceholder?: string
    /**
     * An optional flag to indicate if the size of the select.
     *
     * @defaultValue `"md"`
     */
    size?: SelectSize
    /**
     * An optinal helper text to display below the select.
     *
     * @defaultValue `undefined`
     */
    helperText?: string
    /**
     * Errors provided by a containing form.
     *
     * @defaultValue `undefined`
     */
    errors?: Record<string, unknown>
    /**
     * An optional flag to indicate if the select should be able to select all options.
     *
     * @defaultValue `false`
     */
    selectAll?: boolean
    /**
     * An optinal object that can be used to override the default styles of the select components.
     *
     * @defaultValue `undefined`
     */
    customStyles?: SelectComponentStyles
  }
}

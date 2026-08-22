import clsx from "clsx"
import {
  ButtonHTMLAttributes,
  forwardRef,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react"

// TODO: Add Toaster component back when needed for notifications

// Re-export clsx as clx for compatibility
export { clsx as clx }

// Text Component
type TextProps = HTMLAttributes<HTMLParagraphElement> & {
  as?: "p" | "span" | "div"
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, as: Component = "p", children, ...props }, ref) => {
    return (
      <Component ref={ref} className={clsx("text-base", className)} {...props}>
        {children}
      </Component>
    )
  }
)
Text.displayName = "Text"

// Heading Component
type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: "h1" | "h2" | "h3"
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level: Component = "h2", children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={clsx(
          "font-semibold",
          Component === "h1" && "text-3xl",
          Component === "h2" && "text-2xl",
          Component === "h3" && "text-xl",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
Heading.displayName = "Heading"

// Button Component
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "transparent"
  size?: "small" | "medium" | "large"
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "medium",
      isLoading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          "inline-flex gap-2 items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variant === "primary" && "bg-black text-white hover:bg-gray-800",
          variant === "secondary" &&
            "bg-white text-black border border-gray-200 hover:bg-gray-50",
          variant === "transparent" && "bg-transparent hover:bg-gray-100",
          size === "small" && "h-8 px-3 text-sm",
          size === "medium" && "h-10 px-4",
          size === "large" && "h-12 px-6 text-lg",
          className
        )}
        {...props}
      >
        {isLoading ? "Loading..." : children}
      </button>
    )
  }
)
Button.displayName = "Button"

// Container Component
type ContainerProps = HTMLAttributes<HTMLDivElement>

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx("bg-white rounded-lg p-4", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Container.displayName = "Container"

// Badge Component
type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  color?: "green" | "red" | "blue" | "orange" | "grey" | "purple"
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, color = "grey", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
          color === "green" && "bg-green-100 text-green-700",
          color === "red" && "bg-red-100 text-red-700",
          color === "blue" && "bg-blue-100 text-blue-700",
          color === "orange" && "bg-orange-100 text-orange-700",
          color === "grey" && "bg-gray-100 text-gray-700",
          color === "purple" && "bg-purple-100 text-purple-700",
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)
Badge.displayName = "Badge"

// IconBadge Component
type IconBadgeProps = HTMLAttributes<HTMLSpanElement>

export const IconBadge = forwardRef<HTMLSpanElement, IconBadgeProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center rounded-full bg-gray-100 p-1",
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)
IconBadge.displayName = "IconBadge"

// IconButton Component
type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2",
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
IconButton.displayName = "IconButton"

// Label Component
type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={clsx("text-sm font-medium", className)}
        {...props}
      >
        {children}
      </label>
    )
  }
)
Label.displayName = "Label"

// Input Component
type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && <Label>{label}</Label>}
        <input
          ref={ref}
          className={clsx(
            "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

// Table Components
type TableProps = TableHTMLAttributes<HTMLTableElement>

const TableRoot = forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <table
        ref={ref}
        className={clsx("w-full caption-bottom text-sm", className)}
        {...props}
      >
        {children}
      </table>
    )
  }
)
TableRoot.displayName = "Table"

type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={clsx("[&_tr]:border-b", className)}
        {...props}
      >
        {children}
      </thead>
    )
  }
)
TableHeader.displayName = "TableHeader"

type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tbody
        ref={ref}
        className={clsx("[&_tr:last-child]:border-0", className)}
        {...props}
      >
        {children}
      </tbody>
    )
  }
)
TableBody.displayName = "TableBody"

type TableRowProps = HTMLAttributes<HTMLTableRowElement>

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={clsx(
          "border-b transition-colors hover:bg-gray-50",
          className
        )}
        {...props}
      >
        {children}
      </tr>
    )
  }
)
TableRow.displayName = "TableRow"

type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={clsx(
          "h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0",
          className
        )}
        {...props}
      >
        {children}
      </th>
    )
  }
)
TableHead.displayName = "TableHead"

type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={clsx(
          "p-4 align-middle [&:has([role=checkbox])]:pr-0",
          className
        )}
        {...props}
      >
        {children}
      </td>
    )
  }
)
TableCell.displayName = "TableCell"

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Head: TableHead,
  HeaderCell: TableHead,
  Cell: TableCell,
})

// RadioGroup Components
type RadioGroupProps = HTMLAttributes<HTMLDivElement>

const RadioGroupRoot = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx("flex flex-col gap-2", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
RadioGroupRoot.displayName = "RadioGroup"

type RadioGroupItemProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

const RadioGroupItem = forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="radio"
          id={id}
          className={clsx(
            "h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-900",
            className
          )}
          {...props}
        />
        {label && <Label htmlFor={id}>{label}</Label>}
      </div>
    )
  }
)
RadioGroupItem.displayName = "RadioGroupItem"

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem,
})

// Checkbox Component
type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="checkbox"
          id={id}
          className={clsx(
            "h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900",
            className
          )}
          {...props}
        />
        {label && <Label htmlFor={id}>{label}</Label>}
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

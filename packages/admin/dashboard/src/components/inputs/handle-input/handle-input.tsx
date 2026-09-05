import { Input, Text } from "@medusajs/ui"
import {
  ComponentProps,
  ElementRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
  forwardRef,
} from "react"

export type HandleInputProps = ComponentProps<typeof Input>

export const HandleInput: ForwardRefExoticComponent<
  PropsWithoutRef<HandleInputProps> & RefAttributes<ElementRef<typeof Input>>
> = forwardRef<ElementRef<typeof Input>, HandleInputProps>((props, ref) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 z-10 flex w-8 items-center justify-center border-r">
        <Text
          className="text-ui-fg-muted"
          size="small"
          leading="compact"
          weight="plus"
        >
          /
        </Text>
      </div>
      <Input ref={ref} {...props} className="pl-10" />
    </div>
  )
})
HandleInput.displayName = "HandleInput"

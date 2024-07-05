import { clx } from "@medusajs/ui"
import { PropsWithChildren } from "react"

type IconAvatarProps = PropsWithChildren<{
  className?: string
}>

/**
 * Use this component when a design calls for an avatar with an icon.
 *
 * The `<Avatar/>` component from `@medusajs/ui` does not support passing an icon as a child.
 */
export const IconAvatar = ({ children, className }: IconAvatarProps) => {
  return (
    <div
      className={clx(
        "shadow-borders-base bg-ui-bg-base flex size-7 items-center justify-center rounded-md",
        "[&>div]:bg-ui-bg-field [&>div]:text-ui-fg-subtle [&>div]:flex [&>div]:size-6 [&>div]:items-center [&>div]:justify-center [&>div]:rounded-[4px]",
        className
      )}
    >
      <div>{children}</div>
    </div>
  )
}

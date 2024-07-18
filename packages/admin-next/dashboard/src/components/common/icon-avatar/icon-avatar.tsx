import { clx } from "@medusajs/ui"
import { PropsWithChildren } from "react"

type IconAvatarProps = PropsWithChildren<{
  className?: string
  size?: "small" | "large" | "xlarge"
}>

/**
 * Use this component when a design calls for an avatar with an icon.
 *
 * The `<Avatar/>` component from `@medusajs/ui` does not support passing an icon as a child.
 */
export const IconAvatar = ({
  size = "small",
  children,
  className,
}: IconAvatarProps) => {
  return (
    <div
      className={clx(
        "shadow-borders-base flex size-7 items-center justify-center",
        "[&>div]:bg-ui-bg-field [&>div]:text-ui-fg-subtle [&>div]:flex [&>div]:size-6 [&>div]:items-center [&>div]:justify-center",
        {
          "size-7 rounded-md [&>div]:size-6 [&>div]:rounded-[4px]":
            size === "small",
          "size-10 rounded-lg [&>div]:size-9 [&>div]:rounded-[6px]":
            size === "large",
          "size-12 rounded-xl [&>div]:size-11 [&>div]:rounded-[10px]":
            size === "xlarge",
        },
        className
      )}
    >
      <div>{children}</div>
    </div>
  )
}

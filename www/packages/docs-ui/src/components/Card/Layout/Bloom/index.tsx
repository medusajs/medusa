import React from "react"
import clsx from "clsx"
import { Link } from "@/components/Link"
import { TriangleRightMini } from "@medusajs/icons"
import { BloomIcon, CardProps } from "../../.."

export const CardBloomLayout = ({
  title,
  text,
  href,
  className,
  contentClassName,
  children,
  onClick,
}: CardProps) => {
  return (
    <div
      className={clsx(
        "w-full rounded-docs_DEFAULT",
        "py-docs_0.5 px-docs_0.75 relative",
        "flex justify-start items-center gap-docs_0.75",
        "bg-bg-bloom-callout",
        "border-[0.5px] border-medusa-alphas-alpha-10",
        "hover:border-medusa-tag-orange-border transition-colors",
        className
      )}
    >
      <div
        className={clsx(
          "flex flex-col gap-docs_0.125 flex-1 overflow-auto",
          contentClassName
        )}
      >
        <div className="flex gap-[6px] items-center">
          <BloomIcon className="text-medusa-tag-orange-text" />
          {title && (
            <div
              className={clsx(
                "text-x-small-plus truncate",
                "bg-bg-bloom-callout-text bg-clip-text text-transparent"
              )}
              data-testid="title"
            >
              {title}
            </div>
          )}
        </div>
        {text && (
          <span
            className={clsx(
              "text-small-plus",
              "bg-bg-bloom-callout-text bg-clip-text text-transparent"
            )}
            data-testid="text"
          >
            {text}
          </span>
        )}
        {children}
      </div>
      <span className="text-medusa-tag-blue-text">
        <TriangleRightMini data-testid="internal-icon" />
      </span>

      {href && (
        <Link
          href={href}
          className="absolute left-0 top-0 h-full w-full rounded"
          prefetch={false}
          aria-label={title}
          onClick={onClick}
        />
      )}
    </div>
  )
}

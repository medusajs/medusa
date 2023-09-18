import { ArrowUpRightOnBox } from "@medusajs/icons"
import clsx from "clsx"
import Link from "next/link"

type CardProps = {
  title: string
  text?: string
  href?: string
  className?: string
}

const Card = ({ title, text, href, className }: CardProps) => {
  return (
    <div
      className={clsx(
        "bg-ui-bg-subtle w-full rounded",
        "shadow-elevation-card-rest py-0.75 relative px-1",
        "flex items-center justify-between gap-1 transition-shadow",
        href && "hover:shadow-elevation-card-hover",
        className
      )}
    >
      <div className="flex flex-col">
        <span className="text-compact-medium-plus text-ui-fg-base">
          {title}
        </span>
        {text && <span className="text-compact-medium">{text}</span>}
      </div>

      {href && (
        <>
          <ArrowUpRightOnBox />
          <Link
            href={href}
            className="absolute left-0 top-0 h-full w-full rounded"
          />
        </>
      )}
    </div>
  )
}

export default Card

import clsx from "clsx"
import Link from "next/link"
import IconArrowUpRightOnBox from "../Icons/ArrowUpRightOnBox"

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
        "bg-medusa-bg-subtle dark:bg-medusa-code-bg-base-dark w-full rounded",
        "shadow-card-rest dark:shadow-card-rest-dark py-0.75 relative px-1",
        "flex items-center justify-between gap-1 transition-shadow",
        href && "hover:shadow-card-hover dark:hover:shadow-card-hover-dark",
        className
      )}
    >
      <div className="flex flex-col">
        <span className="text-compact-medium-plus text-medusa-fg-base dark:text-medusa-fg-base-dark">
          {title}
        </span>
        {text && <span className="text-compact-medium">{text}</span>}
      </div>

      {href && (
        <>
          <IconArrowUpRightOnBox />
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

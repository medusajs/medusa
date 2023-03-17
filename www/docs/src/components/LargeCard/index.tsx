import React from "react"
import "./index.css"
import BorderedIcon from "../BorderedIcon"
import clsx from "clsx"
import Badge from "../Badge"
import { IconProps } from "@site/src/theme/Icon/index"

type LargeCardProps = {
  Icon: React.FC<IconProps>
  image: {
    light: string
    dark?: string
  }
  title: string
  action: {
    href: string
  }
  isSoon?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const LargeCard: React.FC<LargeCardProps> = ({
  Icon,
  image,
  title,
  action: { href },
  isSoon = false,
  children,
}) => {
  return (
    <article className={clsx("large-card", isSoon && "large-card-soon")}>
      <div>
        {isSoon && (
          <Badge variant={"purple"} className={"large-card-badge"}>
            Guide coming soon
          </Badge>
        )}
        {(Icon || image) && (
          <BorderedIcon
            IconComponent={Icon}
            icon={image}
            iconClassName="large-card-icon"
            wrapperClassName="large-card-bordered-icon-wrapper"
            iconWrapperClassName="large-card-icon-wrapper"
          />
        )}
        <div className="large-card-heading">
          <span className="large-card-title">{title}</span>
        </div>
        <div className="large-card-content">{children}</div>
      </div>
      <a href={href} className="large-card-link"></a>
    </article>
  )
}

export default LargeCard

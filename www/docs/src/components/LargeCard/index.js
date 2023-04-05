import React from "react"
import './index.css'
import BorderedIcon from "../BorderedIcon"
import clsx from 'clsx';
import Badge from "../Badge";

export default function LargeCard ({
  Icon,
  image,
  title,
  action: {
    href
  },
  isSoon = false,
  children
}) {
  return (
    <article className={clsx(
      'large-card',
      isSoon && 'large-card-soon'
    )}>
      <div>
        {isSoon && <Badge variant={'purple'} className={'large-card-badge'}>Guide coming soon</Badge>}
        {(Icon || image) && (
          <BorderedIcon
            IconComponent={Icon}
            icon={image}
            iconClassName='large-card-icon'
            wrapperClassName='large-card-bordered-icon-wrapper'
            iconWrapperClassName='large-card-icon-wrapper'
          />
        )}
        <div className="large-card-heading">
          <span className="large-card-title">{title}</span>
        </div>
        <div className="large-card-content">
          {children}
        </div>
      </div>
      <a href={href} className="large-card-link"></a>
    </article>
  )
}
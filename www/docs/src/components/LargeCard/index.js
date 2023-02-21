import React from "react"
import ThemedImage from '@theme/ThemedImage'
import Bordered from '../Bordered'
import './index.css'
import BorderedIcon from "../BorderedIcon"

export default function LargeCard ({
  Icon,
  image,
  title,
  action: {
    label,
    href
  },
  children
}) {
  return (
    <article className="large-card">
      <div>
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
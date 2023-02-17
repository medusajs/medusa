import React from "react"
import ThemedImage from '@theme/ThemedImage'
import Bordered from '../Bordered'
import './index.css'

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
          <Bordered wrapperClassName={'large-card-icon-wrapper'}>
            {image && <ThemedImage alt={title} sources={{
                light: image.light,
                dark: image.dark || image.light
              }} className="large-card-icon" />}
            {Icon && <Icon  className="large-card-icon" />}
          </Bordered>
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
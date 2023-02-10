import React from "react"
import ThemedImage from '@theme/ThemedImage'
import Bordered from '../Bordered'
import './index.css'

export default function LargeCard ({
  icon,
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
        {icon && (
          <Bordered wrapperClassName={'large-card-icon-wrapper'}>
            <ThemedImage alt={title} sources={{
                light: icon.light,
                dark: icon.dark || icon.light
              }} className="large-card-icon" />
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
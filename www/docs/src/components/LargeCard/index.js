import React from "react"
import ThemedImage from '@theme/ThemedImage'
import './index.css'
// import MDXContent from '@theme/MDXContent'

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
        <div className="large-card-heading">
          {icon && (
            <div className="large-card-icon-wrapper">
              <ThemedImage alt={title} sources={{
                  light: icon.light,
                  dark: icon.dark || icon.light
                }} className="large-card-icon" />
            </div>
          )}
          <span className="large-card-title">{title}</span>
        </div>
        <div className="large-card-content">
          {children}
        </div>
      </div>
      <div className="large-card-action-wrapper">
        <a href={href} className="large-card-action">{label}</a>
      </div>
    </article>
  )
}
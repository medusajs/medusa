import React from "react"
import clsx from 'clsx'

export default function LargeCardList ({ colSize, className, children }) {
  return (
    <section className={clsx('cards-grid', `grid-${colSize || '4'}`, className)}>
      {children}
    </section>
  )
}
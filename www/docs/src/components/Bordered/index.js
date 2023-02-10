import React from "react"
import clsx from 'clsx'
import styles from './styles.module.css'

export default function Bordered ({ wrapperClassName, children }) {
  return (
    <span className={clsx(styles.elementWrapper, 'no-zoom-img', wrapperClassName)}>
      {children}
    </span>
  )
}
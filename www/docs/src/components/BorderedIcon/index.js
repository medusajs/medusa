import React from "react"
import ThemedImage from '@theme/ThemedImage'
import clsx from 'clsx'
import styles from './styles.module.css'

export default function BorderedIcon ({ icon, wrapperClassName, iconClassName }) {
  return (
    <span className={clsx(styles.iconWrapper, 'no-zoom-img', wrapperClassName)}>
      <ThemedImage sources={{
        light: icon.light,
        dark: icon.dark || icon.light
      }} className={clsx(styles.icon, iconClassName)} />
    </span>
  )
}
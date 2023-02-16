import React from "react"
import ThemedImage from '@theme/ThemedImage'
import clsx from 'clsx'
import styles from './styles.module.css'
import Bordered from "../Bordered"

export default function BorderedIcon ({ icon = null, IconComponent = null, wrapperClassName, iconClassName }) {
  return (
    <Bordered wrapperClassName={wrapperClassName}>
      {!IconComponent && (
        <ThemedImage sources={{
          light: icon.light,
          dark: icon.dark || icon.light
        }} className={clsx(styles.icon, iconClassName)} />
      )}
      {IconComponent && <IconComponent className={clsx(styles.icon, iconClassName)} />}
    </Bordered>
  )
}
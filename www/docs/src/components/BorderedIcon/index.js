import React from "react"
import ThemedImage from '@theme/ThemedImage'
import clsx from 'clsx'
import styles from './styles.module.css'
import Bordered from "../Bordered"

export default function BorderedIcon ({ icon, wrapperClassName, iconClassName }) {
  return (
    <Bordered wrapperClassName={wrapperClassName}>
      <ThemedImage sources={{
        light: icon.light,
        dark: icon.dark || icon.light
      }} className={clsx(styles.icon, iconClassName)} />
    </Bordered>
  )
}
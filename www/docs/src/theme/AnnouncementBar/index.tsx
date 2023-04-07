import React from "react"
import { useThemeConfig } from "@docusaurus/theme-common"
import { useAnnouncementBar } from "@docusaurus/theme-common/internal"
import AnnouncementBarCloseButton from "@theme/AnnouncementBar/CloseButton"
import AnnouncementBarContent from "@theme/AnnouncementBar/Content"

import styles from "./styles.module.css"
import Bordered from "@site/src/components/Bordered"
import IconBell from "@site/src/theme/Icon/Bell/index"

export default function AnnouncementBar(): JSX.Element | null {
  const { announcementBar } = useThemeConfig()
  const { isActive, close } = useAnnouncementBar()
  if (!isActive) {
    return null
  }
  const { backgroundColor, textColor, isCloseable, id } = announcementBar!
  return (
    <div
      className={styles.announcementBar}
      style={{ backgroundColor, color: textColor }}
    >
      <Bordered>
        <div className={styles.announcementBarIconWrapper}>
          <IconBell />
        </div>
      </Bordered>
      <AnnouncementBarContent className={styles.announcementBarContent} />
      {isCloseable && (
        <AnnouncementBarCloseButton
          onClick={close}
          className={styles.announcementBarClose}
        />
      )}
      <a href={id} className={styles.announcementBarLink} />
    </div>
  )
}

import React from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import {useAnnouncementBar} from '@docusaurus/theme-common/internal';
import AnnouncementBarCloseButton from '@theme/AnnouncementBar/CloseButton';
import AnnouncementBarContent from '@theme/AnnouncementBar/Content';
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

export default function AnnouncementBar() {
  const {announcementBar} = useThemeConfig();
  const {isActive, close} = useAnnouncementBar();
  if (!isActive) {
    return null;
  }
  const {backgroundColor, textColor, isCloseable, id} = announcementBar;
  return (
    <div
      className={styles.announcementBar}
      style={{backgroundColor, color: textColor}}>
      <div
        className={styles.announcementBarIconWrapper}>
        <ThemedImage alt="announcement" sources={{
          light: useBaseUrl('/img/bell.png'),
          dark: useBaseUrl('/img/bell-dark.png')
        }} className={styles.announcementBarIcon} />
      </div>
      <AnnouncementBarContent className={styles.announcementBarContent} />
      {isCloseable && (
        <AnnouncementBarCloseButton
          onClick={close}
          className={styles.announcementBarClose}
        />
      )}
      <a href={id} className={styles.announcementBarLink} />
    </div>
  );
}

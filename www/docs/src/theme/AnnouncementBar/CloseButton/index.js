import React from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';
import IconClose from '@theme/Icon/Close';
import styles from './styles.module.css';
export default function AnnouncementBarCloseButton(props) {
  return (
    <button
      type="button"
      aria-label={translate({
        id: 'theme.AnnouncementBar.closeButtonAriaLabel',
        message: 'Close',
        description: 'The ARIA label for close button of announcement bar',
      })}
      {...props}
      className={clsx('clean-btn close', styles.closeButton, props.className)}>
      <IconClose width={20} height={20} strokeWidth={1.5} />
    </button>
  );
}

import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import styles from './styles.module.css';
import DocSidebarItemIcon from '../Icon';

export default function DocSidebarItemHtml({item, level, index}) {
  const {value, defaultStyle, className, customProps} = item;

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        defaultStyle && [styles.menuHtmlItem, 'menu__list-item'],
        className,
        customProps?.sidebar_is_title && 'sidebar-title',
        customProps?.sidebar_is_group_headline && 'sidebar-group-headline',
        customProps?.sidebar_is_group_divider && 'sidebar-group-divider',
        customProps?.sidebar_is_divider_line && 'sidebar-divider-line',
        customProps?.sidebar_is_back_link && 'sidebar-back-link',
        customProps?.sidebar_is_soon && 'sidebar-soon-link sidebar-badge-wrapper',
      )}

      key={index}
    >
    {customProps?.sidebar_icon && (
      <DocSidebarItemIcon icon={customProps.sidebar_icon} is_title={customProps.sidebar_is_title} />
    )}
      <span
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{__html: value}}
      >

      </span>
    {customProps?.sidebar_is_soon && (
      <Badge variant='purple' className={`sidebar-soon-badge`}>
        Soon
      </Badge>
    )}
    </li>
  );
}

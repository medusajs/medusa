import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {isActiveSidebarItem} from '@docusaurus/theme-common/internal';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';
import styles from './styles.module.css';
import DocSidebarItemIcon from '../Icon';
import Badge from '../../../components/Badge';

export default function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}) {
  const {href, label, className, autoAddBaseUrl, customProps} = item;
  const isActive = isActiveSidebarItem(item, activePath);
  const isInternalLink = isInternalUrl(href);
  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        'menu__list-item',
        className,
        customProps?.sidebar_is_title && 'sidebar-title',
        customProps?.sidebar_is_group_headline && 'sidebar-group-headline',
        customProps?.sidebar_is_group_divider && 'sidebar-group-divider',
        customProps?.sidebar_is_divider_line && 'sidebar-divider-line',
        customProps?.sidebar_is_back_link && 'sidebar-back-link',
        customProps?.sidebar_is_soon && 'sidebar-soon-link sidebar-badge-wrapper',
      )}
      key={label}>
      <Link
        className={clsx(
          'menu__link',
          !isInternalLink && styles.menuExternalLink,
          {
            'menu__link--active': isActive,
          },
        )}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isActive ? 'page' : undefined}
        to={href}
        {...(isInternalLink && {
          onClick: onItemClick ? () => onItemClick(item) : undefined,
        })}
        {...props}>
        {customProps?.sidebar_icon && (
          <DocSidebarItemIcon icon={customProps.sidebar_icon} is_title={customProps.sidebar_is_title} />
        )}
        {label}
        {!isInternalLink && <IconExternalLink />}
      </Link>
      {customProps?.sidebar_is_soon && (
        <Badge variant='purple' className={`sidebar-soon-badge`}>
          Soon
        </Badge>
      )}
    </li>
  );
}

import React from 'react';
import clsx from 'clsx';
import {useThemeConfig} from '@docusaurus/theme-common';
import Logo from '@theme/Logo';
import CollapseButton from '@theme/DocSidebar/Desktop/CollapseButton';
import Content from '@theme/DocSidebar/Desktop/Content';
import styles from './styles.module.css';
import DocSidebarItem from '@theme/DocSidebarItem';
import SearchBar from '../../SearchBar'

function DocSidebarDesktop({path, sidebar, onCollapse, isHidden}) {
  const {
    navbar: {hideOnScroll},
    docs: {
      sidebar: {hideable},
    },
    sidebarFooter = [],
  } = useThemeConfig();

  return (
    <div
      className={clsx(
        styles.sidebar,
        hideOnScroll && styles.sidebarWithHideableNavbar,
        isHidden && styles.sidebarHidden,
      )}>
      {hideOnScroll && <Logo tabIndex={-1} className={styles.sidebarLogo} />}
      <div className={styles.sidebarSearchContainer}>
        <SearchBar />
      </div>
      <Content path={path} sidebar={sidebar} />
      {sidebarFooter.length > 0 && (
        <ul className={
          clsx(
            styles.sidebarFooterList
          )
        }>
          {sidebarFooter.map((item, index) => (
            <DocSidebarItem key={index} item={item} index={index} level={1} />
          ))}
        </ul>
      )}
      {hideable && <CollapseButton onClick={onCollapse} />}
    </div>
  );
}
export default React.memo(DocSidebarDesktop);

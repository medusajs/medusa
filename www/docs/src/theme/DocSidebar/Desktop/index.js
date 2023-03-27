import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import {useThemeConfig} from '@docusaurus/theme-common';
import Logo from '@theme/Logo';
import CollapseButton from '@theme/DocSidebar/Desktop/CollapseButton';
import Content from '@theme/DocSidebar/Desktop/Content';
import styles from './styles.module.css';
import DocSidebarItem from '@theme/DocSidebarItem';
import SearchBar from '../../SearchBar';
import useIsBrowser from '@docusaurus/useIsBrowser';
import AnnouncementBar from '@theme/AnnouncementBar';
import {useWindowSize} from '@docusaurus/theme-common';

function DocSidebarDesktop({path, sidebar, onCollapse, isHidden}) {
  const {
    navbar: {hideOnScroll},
    docs: {
      sidebar: {hideable},
    },
    sidebarFooter = [],
  } = useThemeConfig();
  const isBrowser = useIsBrowser()
  const sidebarRef = useRef(null)
  const windowSize = useWindowSize();

  useEffect(() => {
    if (isBrowser && sidebarRef.current) {
      function handleScroll () {
        if (!sidebarRef.current.classList.contains('scrolling')) {
          sidebarRef.current.classList.add('scrolling');
          const intervalId = setInterval(() => {
            if (!sidebarRef.current.matches(':hover')) {
              sidebarRef.current.classList.remove('scrolling');
              clearInterval(intervalId);
            }
          }, 300)
        }
      }

      const navElement = sidebarRef.current.querySelector('nav');
      navElement.addEventListener('scroll', handleScroll);

      return () => {
        navElement?.removeEventListener('scroll', handleScroll);
      }
    }
  }, [isBrowser, sidebarRef.current])

  return (
    <div
      className={clsx(
        styles.sidebar,
        'sidebar-desktop',
        hideOnScroll && styles.sidebarWithHideableNavbar,
        isHidden && styles.sidebarHidden,
      )}
      ref={sidebarRef}>
      {hideOnScroll && <Logo tabIndex={-1} className={styles.sidebarLogo} />}
      <div className={styles.sidebarSearchContainer}>
        {windowSize !== 'mobile' && <SearchBar />}
      </div>
      <AnnouncementBar />
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

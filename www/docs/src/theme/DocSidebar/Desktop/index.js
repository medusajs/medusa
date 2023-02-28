import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import {useThemeConfig} from '@docusaurus/theme-common';
import Logo from '@theme/Logo';
import CollapseButton from '@theme/DocSidebar/Desktop/CollapseButton';
import Content from '@theme/DocSidebar/Desktop/Content';
import styles from './styles.module.css';
import useIsBrowser from '@docusaurus/useIsBrowser';
import AnnouncementBar from '@theme/AnnouncementBar';

function DocSidebarDesktop({path, sidebar, onCollapse, isHidden}) {
  const {
    navbar: {hideOnScroll},
    docs: {
      sidebar: {hideable},
    },
  } = useThemeConfig();
  const isBrowser = useIsBrowser()
  const sidebarRef = useRef(null)

  useEffect(() => {
    if (isBrowser && sidebarRef.current) {
      function handleScroll () {
        if (!sidebarRef.current?.classList.contains('scrolling')) {
          sidebarRef.current?.classList.add('scrolling');
          const intervalId = setInterval(() => {
            if (!sidebarRef.current?.matches(':hover')) {
              sidebarRef.current?.classList.remove('scrolling');
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
      <Logo tabIndex={-1} className={styles.sidebarLogo} />
      <AnnouncementBar />
      <Content path={path} sidebar={sidebar} className="main-sidebar" />
      {hideable && <CollapseButton onClick={onCollapse} />}
    </div>
  );
}
export default React.memo(DocSidebarDesktop);

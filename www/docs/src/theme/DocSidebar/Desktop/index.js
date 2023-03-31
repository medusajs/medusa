import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import {useThemeConfig} from '@docusaurus/theme-common';
import CollapseButton from '@theme/DocSidebar/Desktop/CollapseButton';
import Content from '@theme/DocSidebar/Desktop/Content';
import styles from './styles.module.css';
import useIsBrowser from '@docusaurus/useIsBrowser';
import AnnouncementBar from '@theme/AnnouncementBar';
import {useLocation} from '@docusaurus/router';

function DocSidebarDesktop({path, sidebar, onCollapse, isHidden}) {
  const {
    navbar: {hideOnScroll},
    docs: {
      sidebar: {hideable},
    },
  } = useThemeConfig();
  const isBrowser = useIsBrowser()
  const sidebarRef = useRef(null)
  const location = useLocation();

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

      const navElement = sidebarRef.current.querySelector('.main-sidebar');
      navElement.addEventListener('scroll', handleScroll);

      return () => {
        navElement?.removeEventListener('scroll', handleScroll);
      }
    }
  }, [isBrowser, sidebarRef.current])

  useEffect(() => {
    const navElement = sidebarRef.current.querySelector('.main-sidebar'),
      navElementBoundingRect = navElement.getBoundingClientRect();

    //logic to scroll to current active item
    const activeItem = document.querySelector('.sidebar-desktop [aria-current=page]')

    if (!activeItem) {
      return
    }

    const activeItemBoundingReact = activeItem.getBoundingClientRect(),
      //the extra 160 is due to the sticky elements in the sidebar
      isActiveItemVisible = activeItemBoundingReact.top >= 0 && activeItemBoundingReact.bottom + 160 <= navElementBoundingRect.height
    
    if (!isActiveItemVisible) {
      const elementToScrollTo = activeItem,
        elementBounding = elementToScrollTo.getBoundingClientRect()
      //scroll to element
      navElement.scroll({
        //the extra 160 is due to the sticky elements in the sidebar
        top: elementBounding.top - navElementBoundingRect.top + navElement.scrollTop - 160,
        behaviour: 'smooth'
      })
    }
  }, [location])

  return (
    <div
      className={clsx(
        styles.sidebar,
        'sidebar-desktop',
        hideOnScroll && styles.sidebarWithHideableNavbar,
        isHidden && styles.sidebarHidden,
      )}
      ref={sidebarRef}>
      <AnnouncementBar />
      <Content path={path} sidebar={sidebar} className="main-sidebar" />
      {hideable && <CollapseButton onClick={onCollapse} />}
    </div>
  );
}
export default React.memo(DocSidebarDesktop);

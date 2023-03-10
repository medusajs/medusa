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

    //scroll to current active item
    const activeItem = document.querySelector('.sidebar-desktop .menu__link--active'),
      activeItemBoundingReact = activeItem?.getBoundingClientRect(),
      isActiveItemVisible = activeItemBoundingReact.top >= 0 && activeItemBoundingReact.bottom <= navElementBoundingRect.height
    
    if (activeItem && !isActiveItemVisible) {
      //check if it has a parent list item element
      let parentListItem = activeItem.parentElement

      //search only to reach the main sidebar element
      while (parentListItem && !parentListItem.classList.contains('sidebar-desktop')) {
        if (parentListItem.classList.contains('menu__list-item')) {
          // if (parentListItem.firstElementChild?.classList.contains('menu__list-item-collapsible')) {
          //   parentListItem = parentListItem.firstElementChild
          // }
          break;
        }

        parentListItem = parentListItem.parentElement
      }

      const elementToScrollTo = parentListItem || activeItem,
        elementBounding = elementToScrollTo.getBoundingClientRect()
      //scroll to element
      navElement.scroll({
        //the extra 120 is due to the sticky elements in the sidebar
        top: elementBounding.top - navElementBoundingRect.top + navElement.scrollTop - 120,
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

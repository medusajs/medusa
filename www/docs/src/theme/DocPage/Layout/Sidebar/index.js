import React, {useState, useCallback, useRef} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDocsSidebar} from '@docusaurus/theme-common/internal';
import {useLocation} from '@docusaurus/router';
import DocSidebar from '@theme/DocSidebar';
import ExpandButton from '@theme/DocPage/Layout/Sidebar/ExpandButton';
import styles from './styles.module.css';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
// Reset sidebar state when sidebar changes
// Use React key to unmount/remount the children
// See https://github.com/facebook/docusaurus/issues/3414
function ResetOnSidebarChange({children}) {
  const sidebar = useDocsSidebar();
  return (
    <React.Fragment key={sidebar?.name ?? 'noSidebar'}>
      {children}
    </React.Fragment>
  );
}
export default function DocPageLayoutSidebar({
  sidebar,
  hiddenSidebarContainer,
  setHiddenSidebarContainer,
}) {
  const {pathname} = useLocation();
  const [hiddenSidebar, setHiddenSidebar] = useState(false);
  const toggleSidebar = useCallback(() => {
    if (hiddenSidebar) {
      setHiddenSidebar(false);
    }
    setHiddenSidebarContainer((value) => !value);
  }, [setHiddenSidebarContainer, hiddenSidebar]);
  const {name} = useDocsSidebar()
  const sidebarRef = useRef(null)
  return (
          <aside
            className={clsx(
              ThemeClassNames.docs.docSidebarContainer,
              styles.docSidebarContainer,
              hiddenSidebarContainer && styles.docSidebarContainerHidden,
            )}
            onTransitionEnd={(e) => {
              if (!e.currentTarget.classList.contains(styles.docSidebarContainer)) {
                return;
              }
              if (hiddenSidebarContainer) {
                setHiddenSidebar(true);
              }
            }}>
            <SwitchTransition>
              <CSSTransition
                key={name}
                nodeRef={sidebarRef}
                classNames={{
                  enter: 'animate__animated animate__fadeInLeft',
                  exit: 'animate__animated animate__fadeOutLeft'
                }}
                timeout={200}
              >
              <div
                className={styles.sidebarViewportWrapper}
                ref={sidebarRef}>
                <ResetOnSidebarChange>
                  <div
                    className={clsx(
                      styles.sidebarViewport,
                      hiddenSidebar && styles.sidebarViewportHidden,
                    )}>
                    <DocSidebar
                      sidebar={sidebar}
                      path={pathname}
                      onCollapse={toggleSidebar}
                      isHidden={hiddenSidebar}
                    />
                    {hiddenSidebar && <ExpandButton toggleSidebar={toggleSidebar} />}
                  </div>
              </ResetOnSidebarChange>
              </div>
        </CSSTransition>
      </SwitchTransition>
          </aside>
  );
}

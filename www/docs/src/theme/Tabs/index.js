import React, {cloneElement, useEffect, useRef} from 'react';
import clsx from 'clsx';
import {
  useScrollPositionBlocker,
  useTabs,
} from '@docusaurus/theme-common/internal';
import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './styles.module.css';

//ADDED: isCodeTabs and codeTitle props
function TabList({className, block, selectedValue, selectValue, tabValues, isCodeTabs = false, codeTitle}) {
  const tabRefs = [];
  const {blockElementScrollPositionUntilNextRender} =
    useScrollPositionBlocker();
  const codeTabSelectorRef = useRef(null)
  const codeTabsWrapperRef = useRef(null)
  const handleTabChange = (event) => {
    const newTab = event.currentTarget;
    const newTabIndex = tabRefs.indexOf(newTab);
    const newTabValue = tabValues[newTabIndex].value;
    if (newTabValue !== selectedValue) {
      blockElementScrollPositionUntilNextRender(newTab);
      selectValue(newTabValue);
    }
  };
  const handleKeydown = (event) => {
    let focusElement = null;
    switch (event.key) {
      case 'Enter': {
        handleTabChange(event);
        break;
      }
      case 'ArrowRight': {
        const nextTab = tabRefs.indexOf(event.currentTarget) + 1;
        focusElement = tabRefs[nextTab] ?? tabRefs[0];
        break;
      }
      case 'ArrowLeft': {
        const prevTab = tabRefs.indexOf(event.currentTarget) - 1;
        focusElement = tabRefs[prevTab] ?? tabRefs[tabRefs.length - 1];
        break;
      }
      default:
        break;
    }
    focusElement?.focus();
  };

  const changeTabSelectorCoordinates = (selectedTab) => {
    if (!codeTabSelectorRef?.current || !codeTabsWrapperRef?.current) {
      return
    }
    const selectedTabsCoordinates = selectedTab.getBoundingClientRect(),
      tabsWrapperCoordinates = codeTabsWrapperRef.current.getBoundingClientRect();
    codeTabSelectorRef.current.style.left = `${selectedTabsCoordinates.left - tabsWrapperCoordinates.left}px`
    codeTabSelectorRef.current.style.width = `${selectedTabsCoordinates.width}px`
    codeTabSelectorRef.current.style.height = `${selectedTabsCoordinates.height}px`
  }

  useEffect(() => {
    if (codeTabSelectorRef?.current && tabRefs.length) {
      const selectedTab = tabRefs.find((tab) => tab.getAttribute('aria-selected') === 'true')
      if (selectedTab) {
        changeTabSelectorCoordinates(selectedTab)
      }
    }
  }, [codeTabSelectorRef, tabRefs])

  //ADDED: div wrapper to ul
  //ADDED: span with code-title class
  //ADDED: code tab selector
  return (
    <div  className={`tablist-wrapper ${isCodeTabs ? 'code-header' : ''}`}>
      <div className={`tabs-ul-wrapper ${isCodeTabs ? 'code-tabs-ul-wrapper' : ''}`} ref={codeTabsWrapperRef}>
        {isCodeTabs && <span className='code-tab-selector' ref={codeTabSelectorRef}></span>}
        <ul
          role="tablist"
          aria-orientation="horizontal"
          className={clsx(
            'tabs',
            {
              'tabs--block': block,
            },
            className,
          )}>
          {tabValues.map(({value, label, attributes}) => (
            <li
              // TODO extract TabListItem
              role="tab"
              tabIndex={selectedValue === value ? 0 : -1}
              aria-selected={selectedValue === value}
              key={value}
              ref={(tabControl) => tabRefs.push(tabControl)}
              onKeyDown={handleKeydown}
              onClick={handleTabChange}
              {...attributes}
              className={clsx('tabs__item', styles.tabItem, attributes?.className, {
                'tabs__item--active': selectedValue === value,
              })}>
              {label ?? value}
            </li>
          ))}
        </ul>
      </div>
      {isCodeTabs && <span className='code-title'>{codeTitle}</span>}
    </div>
  );
}

//CHANGED: Removed margin-top--md class
function TabContent({lazy, children, selectedValue}) {
  if (lazy) {
    const selectedTabItem = children.find(
      (tabItem) => tabItem.props.value === selectedValue,
    );
    if (!selectedTabItem) {
      // fail-safe or fail-fast? not sure what's best here
      return null;
    }
    return cloneElement(selectedTabItem);
  }
  return (
    <div>
      {children.map((tabItem, i) =>
        cloneElement(tabItem, {
          key: i,
          hidden: tabItem.props.value !== selectedValue,
        }),
      )}
    </div>
  );
}

function TabsComponent(props) {
  const tabs = useTabs(props);
  return (
    <div className={clsx('tabs-container', styles.tabList)}>
      <TabList {...props} {...tabs} />
      <TabContent {...props} {...tabs} />
    </div>
  );
}
export default function Tabs(props) {
  const isBrowser = useIsBrowser();

  useEffect(() => {
    if (!window.localStorage.getItem('docusaurus.tab.npm2yarn')) {
      //set the default
      window.localStorage.setItem('docusaurus.tab.npm2yarn', 'yarn')
    }
  }, []);

  // ADDED: wrapper div + isCodeTabs prop
  return (
    <div className={`tabs-wrapper ${props.wrapperClassName || ''} ${props.groupId === 'npm2yarn' ? 'code-tabs' : ''}`}>
      <TabsComponent
        // Remount tabs after hydration
        // Temporary fix for https://github.com/facebook/docusaurus/issues/5653
        key={String(isBrowser)}
        isCodeTabs={props.wrapperClassName?.search('code-tabs') !== -1 || props.groupId === 'npm2yarn'}
        {...props}
      />
    </div>
  );
}

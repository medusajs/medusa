import React, { useEffect } from 'react';

import Tabs from '@theme-original/Tabs';

export default function TabsWrapper(props) {

  useEffect(() => {
    if (!window.localStorage.getItem('docusaurus.tab.npm2yarn')) {
      //set the default
      window.localStorage.setItem('docusaurus.tab.npm2yarn', 'yarn')
    }
  }, [])

  return (
    <div className={`tabs-wrapper ${props.wrapperClassName}`}>
      <Tabs {...props} />
    </div>
  );
}

import React from 'react';
import {useColorMode} from '@docusaurus/theme-common';

export default function UiIcon ({ lightIcon, darkIcon = '' }) {
  const {colorMode} = useColorMode();
  const icon = colorMode === 'dark' && darkIcon ? darkIcon : lightIcon;

  return (
    <img src={icon} className="ui-icon" />
  )
}
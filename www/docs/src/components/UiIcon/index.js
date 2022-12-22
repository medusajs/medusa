import React from 'react';
import ThemedImage from '@theme/ThemedImage';

export default function UiIcon ({ lightIcon, darkIcon = '', alt = '' }) {

  return (
    <ThemedImage alt={alt} sources={{
      light: lightIcon,
      dark: darkIcon || lightIcon
    }} className="ui-icon" />
  )
}
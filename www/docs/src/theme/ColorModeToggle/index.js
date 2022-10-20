import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {useColorMode} from '@docusaurus/theme-common';

const allowedModes = [
  'light',
  'dark',
  'auto'
]

function ColorModeToggle({className, value, onChange}) {
  const isBrowser = useIsBrowser();
  const {colorMode} = useColorMode();
  const [storageColorMode, setStorageColorMode] = useState(colorMode)

  useEffect(() => {
    if (isBrowser) {
      const previousSelected = window.localStorage.getItem('selected-color-mode')
      if (previousSelected && allowedModes.includes(previousSelected)) {
        setStorageColorMode(previousSelected)
      }
    }
  }, [isBrowser])

  useEffect(() => {
    if (isBrowser && storageColorMode === 'auto') {

      function userPreferenceChangedHandler(event) {
        onChange(event.matches ? "dark" : "light")
      }

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', userPreferenceChangedHandler);

      return () => {
        window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', userPreferenceChangedHandler);
      }
    }
  }, [storageColorMode, isBrowser])

  function handleAutoOption () {
    if (isBrowser) {
      onChange(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    }
  }

  function handleColorModeChange(mode) {
    if (isBrowser) {
      window.localStorage.setItem('selected-color-mode', mode)
      setStorageColorMode(mode)
    }

    if (mode === 'auto') {
      handleAutoOption();
      return;
    }

    onChange(mode);
  }
  
  return (
    <div className={clsx('color-mode-tabs', className)}>
      <button
        className={clsx(
          'pill-button',
          (colorMode === 'light' && storageColorMode === 'light') && 'active'
        )}
        onClick={() => handleColorModeChange('light')}
        disabled={!isBrowser}
        aria-label={'Light'}
      >
        Light
      </button>
      <button
        className={clsx(
          'pill-button',
          (colorMode === 'dark' && storageColorMode === 'dark') && 'active'
        )}
        onClick={() => handleColorModeChange('dark')}
        disabled={!isBrowser}
        aria-label={'Dark'}
      >
        Dark
      </button>
      <button
        className={clsx(
          'pill-button',
          storageColorMode === 'auto' && 'active'
        )}
        onClick={() => handleColorModeChange('auto')}
        disabled={!isBrowser}
        aria-label={'Auto'}
      >
        Auto
      </button>
      
    </div>
  );
}
export default React.memo(ColorModeToggle);

import React, { useEffect, useState } from 'react';

import Redoc from '@theme-original/Redoc';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function RedocWrapper(props) {

  const isBrowser = useIsBrowser();
  const [loading, setLoading] = useState(isBrowser ? document.readyState !== 'complete' : true)
  
  useEffect(() => {
    if (isBrowser) {

      //redocusaurus in dark mode displays styling wrong
      //until the issue is resolved, this is a work around to hide
      //the bad styling
      window.onload = function () {
        setLoading(false);
      }

      //fallback in case the onload function does not execute
      setTimeout(() => {
        if (loading) {
          setLoading(false);
        }
      }, 1000)
      
      function scrollHandler () {
        const redocSidebar = document.querySelector('.redocusaurus .menu-content');
        const navbar = document.querySelector('.navbar');
        if (!redocSidebar || !navbar) {
          return;
        }
  
        let offset = navbar.clientHeight;
        for (let [_, className] of navbar.classList.entries()) {
          if (className.indexOf('navbarHidden') !== -1) {
            offset = 0;
            break;
          }
        }
        
        redocSidebar.style.top = `${offset}px`
      }
  
      window.addEventListener('scroll', scrollHandler);
  
      return () => {
        window.removeEventListener('scroll', scrollHandler);
      }
    }
  }, [isBrowser])
  
  return (
    <div style={{
      opacity: loading ? 0 : 1,
      transition: 'opacity 0.2s'
    }}>
      <Redoc {...props} />
    </div>
  );
}

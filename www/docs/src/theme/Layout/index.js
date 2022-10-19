import React, { useEffect } from 'react';

import Layout from '@theme-original/Layout';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {useLocation} from '@docusaurus/router';

export default function LayoutWrapper(props) {
  
  const isBrowser = useIsBrowser();
  const location = useLocation();

  useEffect(() => {
    if (isBrowser) {
      if (window.analytics) {
        function handlePlay() {
          window.analytics.track('video_played');
        }

        const videos = document.querySelectorAll('video');
        videos.forEach((video) => video.addEventListener('play', handlePlay, {
          once: true,
          capture: true
        }))
  
        return () => {
          videos.forEach((video) => video.removeEventListener('play', handlePlay));
        }
      }
    }
  }, [isBrowser, location.pathname]);

  return (
    <>
      <Layout {...props} />
    </>
  );
}

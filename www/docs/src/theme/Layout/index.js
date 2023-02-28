import React, { useEffect } from 'react';
import clsx from 'clsx';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import {
  PageMetadata,
  SkipToContentFallbackId,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import {useKeyboardNavigation} from '@docusaurus/theme-common/internal';
import SkipToContent from '@theme/SkipToContent';
import Navbar from '@theme/Navbar';
import LayoutProvider from '@theme/Layout/Provider';
import ErrorPageContent from '@theme/ErrorPageContent';
import styles from './styles.module.css';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {useLocation} from '@docusaurus/router';
import StructuredDataSearchbox from '../StructuredData/Searchbox';
import 'animate.css';

export default function Layout(props) {
  const {
    children,
    // noFooter,
    wrapperClassName,
    // Not really layout-related, but kept for convenience/retro-compatibility
    title,
    description,
  } = props;

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

  useKeyboardNavigation();
  return (
    <LayoutProvider>
      <PageMetadata title={title} description={description} />
      {isBrowser && location.pathname === '/' && <StructuredDataSearchbox />}
      <SkipToContent />

      <Navbar />

      <div
        id={SkipToContentFallbackId}
        className={clsx(
          ThemeClassNames.wrapper.main,
          styles.mainWrapper,
          wrapperClassName,
        )}>
        <ErrorBoundary fallback={(params) => <ErrorPageContent {...params} />}>
          {children}
        </ErrorBoundary>
      </div>
    </LayoutProvider>
  );
}

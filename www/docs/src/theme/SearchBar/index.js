import React, { useEffect } from 'react';

import SearchBar from '@theme-original/SearchBar';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {useLocation} from '@docusaurus/router';

export default function SearchBarWrapper(props) {

  const isBrowser = useIsBrowser();
  const location = useLocation();

  useEffect(() => {
    if (isBrowser) {

      function trackSearch(e) {
        if (!e.target.classList?.contains('DocSearch-Input') && !(e.target.tagName.toLowerCase() === "input" && e.target.getAttribute('type') === 'search')) {
          return;
        }
  
        const query = e.target.value;
        if (query.length >= 3 && window.analytics) {
          //send event to segment
          window.analytics.track('search', {
            query
          });
        }
      }

      document.body.addEventListener('keyup', trackSearch);

      return () => {
        document.body.removeEventListener('keyup', trackSearch);
      }
    }
  }, [isBrowser, location.pathname]);

  return (
    <>
      <SearchBar {...props} />
    </>
  );
}

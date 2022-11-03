import React, {isValidElement} from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ElementContent from '@theme/CodeBlock/Content/Element';
import StringContent from '@theme/CodeBlock/Content/String';
import ThemedImage from '@theme/ThemedImage';
import Tooltip from '../Tooltip';
import CopyButton from '../CopyButton';
import {useThemeConfig} from '@docusaurus/theme-common';

/**
 * Best attempt to make the children a plain string so it is copyable. If there
 * are react elements, we will not be able to copy the content, and it will
 * return `children` as-is; otherwise, it concatenates the string children
 * together.
 */
function maybeStringifyChildren(children) {
  if (React.Children.toArray(children).some((el) => isValidElement(el))) {
    return children;
  }
  // The children is now guaranteed to be one/more plain strings
  return Array.isArray(children) ? children.join('') : children;
}
export default function CodeBlock({children: rawChildren, ...props}) {
  // The Prism theme on SSR is always the default theme but the site theme can
  // be in a different mode. React hydration doesn't update DOM styles that come
  // from SSR. Hence force a re-render after mounting to apply the current
  // relevant styles.
  const isBrowser = useIsBrowser();
  const children = maybeStringifyChildren(rawChildren);
  const CodeBlockComp =
    typeof children === 'string' ? StringContent : ElementContent;
  const {reportCodeLinkPrefix} = useThemeConfig();

  return (
    <div className='code-wrapper'>
      <div className='code-header'>
        <Tooltip text="Report Incorrect Code">
          <a href={`${reportCodeLinkPrefix}&title=${encodeURIComponent(`Docs(Code Issue): Code Issue in ${isBrowser ? document?.title : ''}`)}`} target="_blank" className='report-code code-action img-url'>
            <ThemedImage alt='Report Incorrect Code' sources={{
              light: useBaseUrl('/img/alert-code.png'),
              dark: useBaseUrl('/img/alert-code-dark.png')
            }} className="no-zoom-img" />
          </a>
        </Tooltip>
        <CopyButton buttonClassName='code-action' text={children}>
          <ThemedImage alt='Copy to Clipboard' sources={{
            light: useBaseUrl('/img/clipboard-copy.png'),
            dark: useBaseUrl('/img/clipboard-copy-dark.png')
          }} className="no-zoom-img" />
        </CopyButton>
      </div>
      <CodeBlockComp key={String(isBrowser)} {...props}>
        {children}
      </CodeBlockComp>
    </div>
  );
}

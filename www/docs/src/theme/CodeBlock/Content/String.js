import Highlight, {defaultProps} from 'prism-react-renderer';
import React, { useEffect } from 'react';
import {
  containsLineNumbers,
  parseCodeBlockTitle,
  parseLanguage,
  parseLines,
  useCodeWordWrap,
} from '@docusaurus/theme-common/internal';
import {usePrismTheme, useThemeConfig} from '@docusaurus/theme-common';

import Container from '@theme/CodeBlock/Container';
import CopyButton from '../../CopyButton';
import Line from '@theme/CodeBlock/Line';
import ThemedImage from '@theme/ThemedImage';
import Tooltip from '../../Tooltip';
import clsx from 'clsx';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function CodeBlockString({
  children,
  className: blockClassName = '',
  metastring,
  title: titleProp,
  showLineNumbers: showLineNumbersProp,
  language: languageProp,
  noReport = false
}) {
  const {
    prism: {defaultLanguage, magicComments},
    reportCodeLinkPrefix
  } = useThemeConfig();
  const language =
    languageProp ?? parseLanguage(blockClassName) ?? defaultLanguage;
  const prismTheme = usePrismTheme();
  const wordWrap = useCodeWordWrap();
  const isBrowser = useIsBrowser();
  // We still parse the metastring in case we want to support more syntax in the
  // future. Note that MDX doesn't strip quotes when parsing metastring:
  // "title=\"xyz\"" => title: "\"xyz\""
  const title = parseCodeBlockTitle(metastring) || titleProp;
  const {lineClassNames, code} = parseLines(children, {
    metastring,
    language,
    magicComments,
  });
  const showLineNumbers =
    showLineNumbersProp ?? containsLineNumbers(metastring);
  return (
    <Container
      as="div"
      className={clsx(
        blockClassName,
        language &&
          !blockClassName.includes(`language-${language}`) &&
          `language-${language}`,
      )}>
      {title && <div className={styles.codeBlockTitle}>{title}</div>}
      <div className={styles.codeBlockContent}>
        <Highlight
          {...defaultProps}
          theme={prismTheme}
          code={code}
          language={language ?? 'text'}>
          {({className, tokens, getLineProps, getTokenProps}) => (
            <pre
              /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
              tabIndex={0}
              ref={wordWrap.codeBlockRef}
              className={clsx(className, styles.codeBlock, 'thin-scrollbar', tokens.length === 1 ? styles.thinCodeWrapper : '')}>
              <code
                className={clsx(
                  styles.codeBlockLines,
                  showLineNumbers && styles.codeBlockLinesWithNumbering,
                  tokens.length === 1 ? 'thin-code' : ''
                )}>
                {tokens.map((line, i) => (
                  <Line
                    key={i}
                    line={line}
                    getLineProps={getLineProps}
                    getTokenProps={getTokenProps}
                    classNames={lineClassNames[i]}
                    showLineNumbers={showLineNumbers}
                  />
                ))}
              </code>
            </pre>
          )}
        </Highlight>
        <div className={styles.buttonGroup}>
          {!noReport && (
            <Tooltip text="Report Incorrect Code">
              <a href={`${reportCodeLinkPrefix}&title=${encodeURIComponent(`Docs(Code Issue): Code Issue in ${isBrowser ? location.pathname : ''}`)}`} target="_blank" className='report-code code-action img-url'>
                <ThemedImage alt='Report Incorrect Code' sources={{
                  light: useBaseUrl('/img/alert-code.png'),
                  dark: useBaseUrl('/img/alert-code-dark.png')
                }} className="no-zoom-img" />
              </a>
            </Tooltip>
          )}
          <CopyButton buttonClassName='code-action' text={code}>
            <ThemedImage alt='Copy to Clipboard' sources={{
              light: useBaseUrl('/img/clipboard-copy.png'),
              dark: useBaseUrl('/img/clipboard-copy-dark.png')
            }} className="no-zoom-img" />
          </CopyButton>
        </div>
      </div>
    </Container>
  );
}

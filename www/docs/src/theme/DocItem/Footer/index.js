import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import Feedback from '../../../components/Feedback';
import { useDoc } from '@docusaurus/theme-common/internal';
import {useThemeConfig} from '@docusaurus/theme-common';

export default function FooterWrapper(props) {
  const { metadata } = useDoc()
  const { footerFeedback = { event: '' } } = useThemeConfig();

  return (
    <>
      {!metadata.frontMatter?.hide_footer && (
        <div className='docusaurus-mt-lg doc-footer'>
          <Feedback {...footerFeedback} />
          <Footer {...props} />
        </div>
      )}
    </>
  );
}

import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import Feedback from '../../../components/Feedback';
import { useDoc } from '@docusaurus/theme-common/internal';
import {useThemeConfig} from '@docusaurus/theme-common';

export default function FooterWrapper(props) {
  const { metadata } = useDoc()
  const { footerFeedbackEvent = '' } = useThemeConfig();

  return (
    <>
      {!metadata.frontMatter?.hide_footer && (
        <div className='docusaurus-mt-lg doc-footer'>
          <Feedback event={footerFeedbackEvent} />
          <Footer {...props} />
        </div>
      )}
    </>
  );
}

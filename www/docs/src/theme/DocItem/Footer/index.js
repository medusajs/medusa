import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import Feedback from '../../../components/Feedback';
import { useDoc } from '@docusaurus/theme-common/internal';

export default function FooterWrapper(props) {
  const { metadata } = useDoc()

  return (
    <>
      {!metadata.frontMatter?.hide_footer && (
        <div className='docusaurus-mt-lg doc-footer'>
          <Feedback />
          <Footer {...props} />
        </div>
      )}
    </>
  );
}

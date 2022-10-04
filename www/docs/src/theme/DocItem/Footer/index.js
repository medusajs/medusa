import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import Feedback from '../../../components/Feedback';

export default function FooterWrapper(props) {
  return (
    <div className='docusaurus-mt-lg'>
      <Feedback />
      <Footer {...props} />
    </div>
  );
}

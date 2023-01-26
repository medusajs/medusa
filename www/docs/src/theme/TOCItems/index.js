import React from 'react';
import TOCItems from '@theme-original/TOCItems';
import StructuredDataHowTo from '../StructuredData/HowTo';
import { useDoc } from '@docusaurus/theme-common/internal'

export default function TOCItemsWrapper(props) {
  const { frontMatter, contentTitle } = useDoc()
  
  return (
    <>
      <TOCItems {...props} />
      {frontMatter?.addHowToData && <StructuredDataHowTo toc={props.toc} title={contentTitle} />}
    </>
  );
}

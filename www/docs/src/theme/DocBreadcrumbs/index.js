import React from 'react';
import DocBreadcrumbs from '@theme-original/DocBreadcrumbs';
import StructuredDataBreadcrumbs from '../StructuredData/Breadcrumbs'

export default function DocBreadcrumbsWrapper(props) {
  return (
    <>
      <DocBreadcrumbs {...props} />
      <StructuredDataBreadcrumbs />
    </>
  );
}

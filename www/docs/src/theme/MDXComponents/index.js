import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import InlineCode from './InlineCode'
import CloudinaryImage from '../../components/CloudinaryImage';

export default {
  // Re-use the default mapping
  ...MDXComponents,
  inlineCode: InlineCode,
  img: CloudinaryImage
};
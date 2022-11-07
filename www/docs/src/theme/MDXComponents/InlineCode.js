import React, {isValidElement} from 'react';
import CopyButton from '../CopyButton';

export default function MDXInlineCode(props) {

  return (
    <CopyButton text={props.children} buttonClassName="inline-code-copy" tooltipClassName="inline-tooltip">
      <code {...props} />
    </CopyButton>
  )
}

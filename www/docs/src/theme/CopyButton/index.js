import React, { useCallback, useEffect, useRef, useState } from 'react';

import Tooltip from '../Tooltip';
import copy from 'copy-text-to-clipboard';

export default function CopyButton ({ children, buttonClassName, text, tooltipClassName }) {
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeout = useRef(undefined);

  const handleCopy = useCallback(() => {
    copy(text);
    setIsCopied(true);
    copyTimeout.current = window.setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }, [text]);

  useEffect(() => () => window.clearTimeout(copyTimeout.current), []);

  return (
    <Tooltip
      text={isCopied ? `Copied!` : `Copy to Clipboard`}
      tooltipClassName={tooltipClassName}
    >
      <span
        className={`copy-action ${buttonClassName}`}
        onClick={handleCopy}
      >
        {children}
      </span>
    </Tooltip>
  )
}
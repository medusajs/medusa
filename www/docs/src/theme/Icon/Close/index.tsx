import React from 'react';
export default function IconClose({
  width = 20,
  height = 20,
  strokeWidth = 1.5,
  className,
  ...restProps
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...restProps}>
      <path d="M6 14L14 6M6 6L14 14" stroke="var(--ifm-icon-color)" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

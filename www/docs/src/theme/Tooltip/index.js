import React from 'react';

export default function Tooltip ({ children, text, tooltipClassName, ...rest }) {
  const [show, setShow] = React.useState(false);

  return (
    <span className={`tooltip-container ${tooltipClassName || ''}`}>
      <span className={show ? 'tooltip-box visible' : 'tooltip-box'}>
        {text}
      </span>
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        {...rest}
      >
        {children}
      </span>
    </span>
  );
};
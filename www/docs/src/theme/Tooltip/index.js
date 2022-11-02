import React from 'react';

export default function Tooltip ({ children, text, tooltipClassName, ...rest }) {
  const [show, setShow] = React.useState(false);

  return (
    <div className={`tooltip-container ${tooltipClassName || ''}`}>
      <div className={show ? 'tooltip-box visible' : 'tooltip-box'}>
        {text}
      </div>
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
};
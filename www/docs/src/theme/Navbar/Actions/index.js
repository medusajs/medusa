import React from 'react';
import IconReport from '../../Icon/Report';
import Tooltip from '../../Tooltip';

export default function NavbarActions ({items = []}) {

  function findIcon (icon) {
    switch(icon) {
      case 'report':
        return <IconReport />
      default:
        return <></>
    }
  }

  return (
    <div className='navbar-actions'>
      {items.map((item, index) => {
        switch(item.type) {
          case 'link':
            return (
              <Tooltip text='Report an issue' key={index}>
                <a href={item.href} title={item.title} 
                  className={`navbar-action ${item.icon ? 'navbar-link-icon' : ''} ${item.className || ''}`}>
                  {item.label}
                  {item.icon && findIcon(item.icon)}
                </a>
              </Tooltip>
            )
          default:
            return (<></>)
        }
      })}
    </div>
  )
}
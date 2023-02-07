import React from 'react';
import IconReport from '../../Icon/Report';

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
              <a key={index} href={item.href} title={item.title} 
                className={`navbar-action ${item.icon ? 'navbar-link-icon' : ''} ${item.className || ''}`}>
                {item.label}
                {item.icon && findIcon(item.icon)}
              </a>
            )
          default:
            return (<></>)
        }
      })}
    </div>
  )
}
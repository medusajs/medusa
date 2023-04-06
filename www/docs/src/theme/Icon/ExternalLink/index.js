import React from 'react';
import styles from './styles.module.css';
export default function IconExternalLink({width = 16, height = 16}) {
  return (
    <svg 
      width={width}
      height={height} 
      viewBox="0 0 16 16" 
      fill="none" 
      className={styles.iconExternalLink}>
        <path d="M12.0099 3.99023L3.94995 12.0502" stroke="var(--ifm-icon-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.35156 3.94971L12.0098 3.9896L12.0505 9.64865" stroke="var(--ifm-icon-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

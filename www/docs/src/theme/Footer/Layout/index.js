import React from 'react';
import clsx from 'clsx';
import SocialLinks from '../SocialLinks';
import {useThemeConfig} from '@docusaurus/theme-common';

export default function FooterLayout({style, links, logo, copyright}) {
  const { socialLinks } = useThemeConfig()

  return (
    <footer
      className={clsx('footer', {
        'footer--dark': style === 'dark',
      })}>
      <div className="container container-fluid footer-container">
        {(logo || copyright || socialLinks) && (
          <div className="text--center col col--6 social-logo-container">
            <div className='logo-container'>
              {logo && <div className="margin-bottom--sm">{logo}</div>}
              {copyright}
            </div>
            {socialLinks && <SocialLinks links={socialLinks} />}
          </div>
        )}
        <div className="col col--6">
          {links}
        </div>
      </div>
    </footer>
  );
}

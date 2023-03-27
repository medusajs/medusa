import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ThemedImage from '@theme/ThemedImage';

export default function SocialLinks ({ links = [] }) {
  const socialIcons = {
    twitter: {
      light: useBaseUrl('/img/twitter.png'),
      dark: useBaseUrl('/img/twitter-dark.png')
    },
    github: {
      light: useBaseUrl('/img/github.png'),
      dark: useBaseUrl('/img/github-dark.png')
    },
    discord: {
      light: useBaseUrl('/img/discord.png'),
      dark: useBaseUrl('/img/discord-dark.png')
    }
  }

  return (
    <div className='social-links'>
      {links.map((link) => (
        <a className='social-link' href={link.href} key={link.type}>
          <ThemedImage sources={socialIcons[link.type]} alt={link.type} className={`social-icon ${link.type}-icon`} />
        </a>
      ))}
    </div>
  )
}
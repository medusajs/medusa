import React from 'react';
import IconTwitter from '../../Icon/Twitter';
import IconGitHub from '../../Icon/GitHub';
import IconDiscord from '../../Icon/Discord';
import IconLinkedIn from '../../Icon/LinkedIn';

export default function SocialLinks ({ links = [] }) {
  const socialIcons = {
    twitter: <IconTwitter />,
    github: <IconGitHub />,
    discord: <IconDiscord />,
    linkedin: <IconLinkedIn />
  }

  return (
    <div className='social-links'>
      {links.map((link) => (
        <a className='social-link' href={link.href} key={link.type}>
          {socialIcons[link.type]}
        </a>
      ))}
    </div>
  )
}
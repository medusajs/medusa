import {
  findFirstCategoryLink,
  useDocById,
} from '@docusaurus/theme-common/internal';

import Link from '@docusaurus/Link';
import React from 'react';
import clsx from 'clsx';
import isInternalUrl from '@docusaurus/isInternalUrl';
import styles from './styles.module.css';
import {translate} from '@docusaurus/Translate';
import BorderedIcon from '../../components/BorderedIcon';
import Badge from '../../components/Badge';

function CardContainer({href, children, className}) {
  return (
    <Link
      href={href}
      className={clsx('card', styles.cardContainer, className)}>
      {children}
    </Link>
  );
}
function CardLayout({href, icon, title, description, html, containerClassName, isSoon = false}) {
  return (
    <CardContainer href={href} className={clsx(containerClassName, isSoon && styles.cardSoon)}>
      <div className={clsx(styles.cardIconContainer)}>
        {icon}
        {isSoon && <Badge variant={'purple'}>Guide coming soon</Badge>}
      </div>
      <div className={clsx(styles.contentContainer)}>
        <span className={clsx(styles.cardTitle)} title={title}>
          {title}
        </span>
        {description && (
          <p
            className={clsx(styles.cardDescription)}
            title={description}>
            {description}
          </p>
        )}
        {html && (
          <p
            className={clsx(styles.cardDescription)}
            dangerouslySetInnerHTML={{
              __html: html
            }}
          ></p>
        )}
      </div>
    </CardContainer>
  );
}
function CardCategory({item}) {
  const href = findFirstCategoryLink(item);
  // Unexpected: categories that don't have a link have been filtered upfront
  if (!href) {
    return null;
  }
  return (
    <CardLayout
      href={href}
      icon="🗃️"
      title={item.label}
      description={translate(
        {
          message: '{count} items',
          id: 'theme.docs.DocCard.categoryDescription',
          description:
            'The default description for a category card in the generated index about how many items this category includes',
        },
        {count: item.items.length},
      )}
      containerClassName={item.customProps?.className}
      isSoon={item.customProps?.isSoon}
    />
  );
}
function CardLink({item}) {
  let icon;
  if (item.customProps && item.customProps.themedImage) {
    icon = (
      <BorderedIcon icon={{
        light: item.customProps.themedImage.light,
        dark: item.customProps.themedImage.dark
      }} wrapperClassName='card-icon-wrapper' iconClassName={'card-icon'} />
    )
  } else if (item.customProps && item.customProps.image) {
    icon = (
      <BorderedIcon icon={{
        light: item.customProps.image
      }} wrapperClassName='card-icon-wrapper' iconClassName={'card-icon'} />
    );
  } else if (item.customProps && item.customProps.icon) {
    icon = <BorderedIcon 
      IconComponent={item.customProps.icon} 
      wrapperClassName='card-icon-wrapper' iconClassName={'card-icon'} />;
  } else {
    icon = (
      <div className={clsx('card-icon-wrapper', 'no-zoom-img')}>
        {isInternalUrl(item.href) ? '📄️' : '🔗'}
      </div>
    );
  }
  const doc = useDocById(item.docId ?? undefined);

  return (
    <CardLayout
      href={item.href}
      icon={icon}
      title={item.label}
      description={item.customProps?.description || doc?.description}
      html={item.customProps?.html}
      containerClassName={item.customProps?.className}
      isSoon={item.customProps?.isSoon}
    />
  );
}
export default function DocCard({item}) {
  switch (item.type) {
    case 'link':
      return <CardLink item={item} />;
    case 'category':
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}

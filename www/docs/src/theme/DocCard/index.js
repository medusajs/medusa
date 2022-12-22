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
import ThemedImage from '@theme/ThemedImage';

function CardContainer({href, children, className}) {
  return (
    <Link
      href={href}
      className={clsx('card', styles.cardContainer, className)}>
      {children}
    </Link>
  );
}
function CardLayout({href, icon, title, description, containerClassName}) {
  return (
    <CardContainer href={href} className={containerClassName}>
      {icon}
      <div className={clsx(styles.contentContainer)}>
        <h2 className={clsx(styles.cardTitle)} title={title}>
          {title}
        </h2>
        {description && (
          <p
            className={clsx(styles.cardDescription)}
            title={description}>
            {description}
          </p>
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
    />
  );
}
function CardLink({item}) {
  let icon;
  if (item.customProps && item.customProps.themedImage) {
    icon = (
      <div className={clsx(styles.imageContainer, 'no-zoom-img')}>
        <ThemedImage alt={item.label} sources={{
          light: item.customProps.themedImage.light,
          dark: item.customProps.themedImage.dark
        }} />
      </div>
    )
  } else if (item.customProps && item.customProps.image) {
    icon = (
      <div className={clsx(styles.imageContainer, 'no-zoom-img')}>
        <img src={item.customProps.image} alt={item.label} />
      </div>
    );
  } else if (item.customProps && item.customProps.icon) {
    icon = item.customProps.icon;
  } else {
    icon = (
      <div className={clsx(styles.imageContainer, 'no-zoom-img')}>
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
      containerClassName={item.customProps?.className}
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

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

function CardContainer({href, children}) {
  return (
    <Link
      href={href}
      className={clsx('card padding--lg', styles.cardContainer)}>
      {children}
    </Link>
  );
}
function CardLayout({href, icon, title, description}) {
  return (
    <CardContainer href={href}>
      <h2 className={clsx('text--truncate', styles.cardTitle)} title={title}>
        {icon} {title}
      </h2>
      {description && (
        <p
          className={clsx('text--truncate', styles.cardDescription)}
          title={description}>
          {description}
        </p>
      )}
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
    />
  );
}
function CardLink({item}) {
  let icon;
  if (item.customProps && item.customProps.image) {
    icon = <img src={item.customProps.image} alt={item.label} width={24} height={24} />;
  } else if (item.customProps && item.customProps.icon) {
    icon = item.customProps.icon;
  } else {
    icon = isInternalUrl(item.href) ? '📄️' : '🔗';
  }
  const doc = useDocById(item.docId ?? undefined);
  return (
    <CardLayout
      href={item.href}
      icon={icon}
      title={item.label}
      description={doc?.description}
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

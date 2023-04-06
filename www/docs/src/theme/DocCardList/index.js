import React from 'react';
import clsx from 'clsx';
import {
  useCurrentSidebarCategory,
  filterDocCardListItems,
} from '@docusaurus/theme-common';
import DocCard from '@theme/DocCard';
function DocCardListForCurrentSidebarCategory({className}) {
  const category = useCurrentSidebarCategory();
  return <DocCardList items={category.items} className={className} />;
}
export default function DocCardList(props) {
  const {items, className} = props;
  if (!items) {
    return <DocCardListForCurrentSidebarCategory {...props} />;
  }
  const filteredItems = filterDocCardListItems(items);
  return (
    <section className={clsx('cards-grid', `grid-${props.colSize || '4'}`, className)}>
      {filteredItems.map((item, index) => (
        <DocCard item={item} key={index} />
      ))}
    </section>
  );
}

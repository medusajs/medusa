import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function IconEdit({className, ...restProps}) {
  return (
    <ThemedImage alt='Edit' sources={{
      light: useBaseUrl('/img/edit.png'),
      dark: useBaseUrl('/img/edit-dark.png')
    }} className={clsx(styles.iconEdit, className)} {...restProps} />
  );
}

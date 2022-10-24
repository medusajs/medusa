import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';
function NoteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.375 8.375L8.40917 8.35833C8.51602 8.30495 8.63594 8.2833 8.75472 8.29596C8.8735 8.30862 8.98616 8.35505 9.07937 8.42976C9.17258 8.50446 9.24242 8.60432 9.28064 8.71749C9.31885 8.83066 9.32384 8.95242 9.295 9.06833L8.705 11.4317C8.67595 11.5476 8.68078 11.6695 8.71891 11.7828C8.75704 11.8961 8.82687 11.9961 8.92011 12.071C9.01336 12.1458 9.12611 12.1923 9.245 12.205C9.36388 12.2177 9.4839 12.196 9.59083 12.1425L9.625 12.125M16.5 9C16.5 9.98491 16.306 10.9602 15.9291 11.8701C15.5522 12.7801 14.9997 13.6069 14.3033 14.3033C13.6069 14.9997 12.7801 15.5522 11.8701 15.9291C10.9602 16.306 9.98491 16.5 9 16.5C8.01509 16.5 7.03982 16.306 6.12987 15.9291C5.21993 15.5522 4.39314 14.9997 3.6967 14.3033C3.00026 13.6069 2.44781 12.7801 2.0709 11.8701C1.69399 10.9602 1.5 9.98491 1.5 9C1.5 7.01088 2.29018 5.10322 3.6967 3.6967C5.10322 2.29018 7.01088 1.5 9 1.5C10.9891 1.5 12.8968 2.29018 14.3033 3.6967C15.7098 5.10322 16.5 7.01088 16.5 9ZM9 5.875H9.00667V5.88167H9V5.875Z" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function TipIcon() {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.00046 13.571V9.57069M7.00046 9.57069C7.38598 9.57099 7.76999 9.52261 8.14339 9.42668M7.00046 9.57069C6.61493 9.57099 6.23092 9.52261 5.85752 9.42668M8.71486 15.1246C7.58205 15.3397 6.41887 15.3397 5.28605 15.1246M8.14339 16.9403C7.38351 17.0199 6.6174 17.0199 5.85752 16.9403M8.71486 13.571V13.4247C8.71486 12.6757 9.21623 12.0356 9.86389 11.66C10.952 11.0299 11.8019 10.0585 12.2819 8.8964C12.7619 7.73428 12.8453 6.44629 12.5191 5.23199C12.1928 4.0177 11.4752 2.94488 10.4775 2.17978C9.47969 1.41468 8.25743 1 7.00008 1C5.74272 1 4.52046 1.41468 3.52269 2.17978C2.52491 2.94488 1.80732 4.0177 1.48109 5.23199C1.15487 6.44629 1.23823 7.73428 1.71826 8.8964C2.19829 10.0585 3.04819 11.0299 4.13626 11.66C4.78393 12.0356 5.28605 12.6757 5.28605 13.4247V13.571" stroke="#F97316" strokeWidth="1.37152" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function DangerIcon() {
  return (
    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.99961 6.49945V9.62445M1.24711 12.4378C0.52544 13.6878 1.42794 15.2495 2.87044 15.2495H15.1288C16.5704 15.2495 17.4729 13.6878 16.7521 12.4378L10.6238 1.81445C9.90211 0.564453 8.09711 0.564453 7.37544 1.81445L1.24711 12.4378V12.4378ZM8.99961 12.1245H9.00544V12.1311H8.99961V12.1245Z" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>    
  );
}
function InfoIcon() {
  return NoteIcon();
}
function CautionIcon() {
  return DangerIcon();
}
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
const AdmonitionConfigs = {
  note: {
    infimaClassName: 'secondary',
    iconComponent: NoteIcon,
    label: (
      <Translate
        id="theme.admonition.note"
        description="The default label used for the Note admonition (:::note)">
        note
      </Translate>
    ),
  },
  tip: {
    infimaClassName: 'success',
    iconComponent: TipIcon,
    label: (
      <Translate
        id="theme.admonition.tip"
        description="The default label used for the Tip admonition (:::tip)">
        tip
      </Translate>
    ),
  },
  danger: {
    infimaClassName: 'danger',
    iconComponent: DangerIcon,
    label: (
      <Translate
        id="theme.admonition.danger"
        description="The default label used for the Danger admonition (:::danger)">
        danger
      </Translate>
    ),
  },
  info: {
    infimaClassName: 'info',
    iconComponent: InfoIcon,
    label: (
      <Translate
        id="theme.admonition.info"
        description="The default label used for the Info admonition (:::info)">
        info
      </Translate>
    ),
  },
  caution: {
    infimaClassName: 'warning',
    iconComponent: CautionIcon,
    label: (
      <Translate
        id="theme.admonition.caution"
        description="The default label used for the Caution admonition (:::caution)">
        caution
      </Translate>
    ),
  },
};
// Legacy aliases, undocumented but kept for retro-compatibility
const aliases = {
  secondary: 'note',
  important: 'info',
  success: 'tip',
  warning: 'danger',
};
function getAdmonitionConfig(unsafeType) {
  const type = aliases[unsafeType] ?? unsafeType;
  const config = AdmonitionConfigs[type];
  if (config) {
    return config;
  }
  console.warn(
    `No admonition config found for admonition type "${type}". Using Info as fallback.`,
  );
  return AdmonitionConfigs.info;
}
// Workaround because it's difficult in MDX v1 to provide a MDX title as props
// See https://github.com/facebook/docusaurus/pull/7152#issuecomment-1145779682
function extractMDXAdmonitionTitle(children) {
  const items = React.Children.toArray(children);
  const mdxAdmonitionTitle = items.find(
    (item) =>
      React.isValidElement(item) &&
      item.props?.mdxType === 'mdxAdmonitionTitle',
  );
  const rest = <>{items.filter((item) => item !== mdxAdmonitionTitle)}</>;
  return {
    mdxAdmonitionTitle,
    rest,
  };
}
function processAdmonitionProps(props) {
  const {mdxAdmonitionTitle, rest} = extractMDXAdmonitionTitle(props.children);
  return {
    ...props,
    title: props.title ?? mdxAdmonitionTitle,
    children: rest,
  };
}
export default function Admonition(props) {
  const {children, type, title, icon: iconProp} = processAdmonitionProps(props);
  const typeConfig = getAdmonitionConfig(type);
  const titleLabel = title ?? typeConfig.label;
  const {iconComponent: IconComponent} = typeConfig;
  const icon = iconProp ?? <IconComponent />;
  return (
    <div
      className={clsx(
        ThemeClassNames.common.admonition,
        ThemeClassNames.common.admonitionType(props.type),
        'alert',
        `alert--${typeConfig.infimaClassName}`,
        styles.admonition,
      )}>
      <div className={
        clsx(
          styles.admonitionContentContainer
        )
      }>
        <span className={styles.admonitionIcon}>{icon}</span>
        <div className={styles.admonitionContent}>{children}</div>
      </div>
    </div>
  );
}

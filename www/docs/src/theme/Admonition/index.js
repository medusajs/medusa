import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

function NoteIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" 
        d="M18 10C18 12.1217 17.1571 14.1566 15.6569 15.6569C14.1566 17.1571 12.1217 18 10 18C7.87827 18 5.84344 17.1571 4.34315 15.6569C2.84285 14.1566 2 12.1217 2 10C2 7.87827 2.84285 5.84344 4.34315 4.34315C5.84344 2.84285 7.87827 2 10 2C12.1217 2 14.1566 2.84285 15.6569 4.34315C17.1571 5.84344 18 7.87827 18 10ZM11 6C11 6.26522 10.8946 6.51957 10.7071 6.70711C10.5196 6.89464 10.2652 7 10 7C9.73478 7 9.48043 6.89464 9.29289 6.70711C9.10536 6.51957 9 6.26522 9 6C9 5.73478 9.10536 5.48043 9.29289 5.29289C9.48043 5.10536 9.73478 5 10 5C10.2652 5 10.5196 5.10536 10.7071 5.29289C10.8946 5.48043 11 5.73478 11 6ZM9 9C8.80109 9 8.61032 9.07902 8.46967 9.21967C8.32902 9.36032 8.25 9.55109 8.25 9.75C8.25 9.94891 8.32902 10.1397 8.46967 10.2803C8.61032 10.421 8.80109 10.5 9 10.5H9.253C9.29041 10.5 9.32734 10.5084 9.36106 10.5246C9.39479 10.5408 9.42445 10.5643 9.44787 10.5935C9.47128 10.6227 9.48785 10.6567 9.49636 10.6932C9.50486 10.7296 9.50508 10.7675 9.497 10.804L9.038 12.87C8.98108 13.1259 8.98237 13.3913 9.04179 13.6466C9.10121 13.902 9.21723 14.1407 9.38129 14.3452C9.54535 14.5496 9.75325 14.7146 9.98963 14.828C10.226 14.9413 10.4848 15.0001 10.747 15H11C11.1989 15 11.3897 14.921 11.5303 14.7803C11.671 14.6397 11.75 14.4489 11.75 14.25C11.75 14.0511 11.671 13.8603 11.5303 13.7197C11.3897 13.579 11.1989 13.5 11 13.5H10.747C10.7096 13.5 10.6727 13.4916 10.6389 13.4754C10.6052 13.4592 10.5755 13.4357 10.5521 13.4065C10.5287 13.3773 10.5121 13.3433 10.5036 13.3068C10.4951 13.2704 10.4949 13.2325 10.503 13.196L10.962 11.13C11.0189 10.8741 11.0176 10.6087 10.9582 10.3534C10.8988 10.098 10.7828 9.8593 10.6187 9.65483C10.4547 9.45036 10.2468 9.28536 10.0104 9.17201C9.77398 9.05867 9.51515 8.99989 9.253 9H9Z" 
        fill="var(--ifm-note-info-color)"
      />
    </svg>
  );
}
function TipIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.0002 1.81238C8.6789 1.81208 7.39444 2.24761 6.34586 3.05146C5.29727 3.85532 4.54312 4.9826 4.20028 6.2586C3.85744 7.5346 3.94507 8.88806 4.44958 10.1092C4.95409 11.3303 5.84731 12.351 6.99079 13.0129C7.49005 13.3026 7.80226 13.7465 7.81609 14.1941C7.81991 14.314 7.86311 14.4293 7.93901 14.5221C8.01492 14.615 8.1193 14.6803 8.23602 14.7079C8.4922 14.7683 8.75274 14.8156 9.01766 14.8498C9.25273 14.8797 9.45432 14.6912 9.45432 14.4539V11.0617C9.22435 11.0364 8.99647 10.9948 8.77239 10.9373C8.70296 10.9194 8.63773 10.888 8.58042 10.8449C8.52311 10.8019 8.47485 10.7479 8.43839 10.6862C8.40193 10.6244 8.37798 10.5561 8.36792 10.4851C8.35786 10.4142 8.36189 10.3419 8.37976 10.2724C8.39763 10.203 8.429 10.1378 8.47209 10.0805C8.51517 10.0232 8.56912 9.9749 8.63085 9.93844C8.69259 9.90198 8.7609 9.87804 8.83189 9.86798C8.90288 9.85792 8.97515 9.86194 9.04458 9.87981C9.67139 10.0414 10.3289 10.0414 10.9557 9.87981C11.0259 9.8596 11.0993 9.85366 11.1718 9.86235C11.2443 9.87103 11.3143 9.89416 11.3776 9.93037C11.441 9.96658 11.4965 10.0151 11.5408 10.0731C11.585 10.1312 11.6172 10.1975 11.6354 10.2682C11.6536 10.3388 11.6575 10.4124 11.6468 10.4846C11.636 10.5568 11.6109 10.6261 11.5729 10.6885C11.5349 10.7508 11.4848 10.8048 11.4255 10.8474C11.3663 10.8901 11.2991 10.9204 11.2279 10.9365C11.0039 10.9944 10.776 11.0362 10.546 11.0617V14.4532C10.546 14.6912 10.7476 14.8797 10.9827 14.8498C11.2476 14.8156 11.5081 14.7683 11.7643 14.7079C11.881 14.6803 11.9854 14.615 12.0613 14.5221C12.1372 14.4293 12.1804 14.314 12.1842 14.1941C12.1988 13.7465 12.5103 13.3026 13.0095 13.0129C14.153 12.351 15.0462 11.3303 15.5507 10.1092C16.0552 8.88806 16.1429 7.5346 15.8 6.2586C15.4572 4.9826 14.703 3.85532 13.6545 3.05146C12.6059 2.24761 11.3214 1.81208 10.0002 1.81238Z" 
        fill="var(--ifm-note-tip-color)"/>
      <path fillRule="evenodd" clipRule="evenodd" 
        d="M7.82589 15.7493C7.83925 15.6788 7.86637 15.6117 7.90568 15.5517C7.94499 15.4918 7.99573 15.4401 8.05501 15.3998C8.11428 15.3594 8.18092 15.3312 8.25112 15.3166C8.32132 15.302 8.39371 15.3014 8.46415 15.3148C9.47884 15.5073 10.5207 15.5073 11.5354 15.3148C11.6067 15.2991 11.6804 15.2978 11.7522 15.3111C11.824 15.3244 11.8923 15.352 11.9533 15.3922C12.0142 15.4324 12.0665 15.4844 12.107 15.5452C12.1474 15.6059 12.1753 15.6742 12.189 15.7459C12.2026 15.8176 12.2017 15.8914 12.1863 15.9627C12.171 16.0341 12.1414 16.1017 12.0995 16.1614C12.0576 16.2212 12.0041 16.2719 11.9422 16.3106C11.8803 16.3493 11.8112 16.3752 11.7392 16.3868C10.5898 16.6049 9.40971 16.6049 8.26037 16.3868C8.11825 16.3598 7.99266 16.2775 7.91119 16.1579C7.82973 16.0384 7.79904 15.8914 7.82589 15.7493ZM8.36517 17.5279C8.37262 17.4566 8.39404 17.3875 8.42821 17.3245C8.46238 17.2615 8.50863 17.2058 8.56432 17.1606C8.62001 17.1155 8.68404 17.0818 8.75277 17.0614C8.82149 17.041 8.89357 17.0343 8.96486 17.0418C9.65293 17.1137 10.3466 17.1137 11.0347 17.0418C11.1787 17.0267 11.3227 17.0695 11.4352 17.1607C11.5477 17.2518 11.6193 17.384 11.6344 17.5279C11.6494 17.6719 11.6067 17.816 11.5155 17.9285C11.4243 18.0409 11.2922 18.1126 11.1482 18.1276C10.3847 18.2076 9.61487 18.2076 8.85133 18.1276C8.78003 18.1202 8.7109 18.0988 8.64787 18.0646C8.58485 18.0304 8.52918 17.9842 8.48404 17.9285C8.43889 17.8728 8.40516 17.8088 8.38476 17.74C8.36437 17.6713 8.35771 17.5992 8.36517 17.5279Z" 
        fill="var(--ifm-note-tip-color)"/>
    </svg>
  );
}
function DangerIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" 
        d="M18 10C18 12.1217 17.1571 14.1566 15.6569 15.6569C14.1566 17.1571 12.1217 18 10 18C7.87827 18 5.84344 17.1571 4.34315 15.6569C2.84285 14.1566 2 12.1217 2 10C2 7.87827 2.84285 5.84344 4.34315 4.34315C5.84344 2.84285 7.87827 2 10 2C12.1217 2 14.1566 2.84285 15.6569 4.34315C17.1571 5.84344 18 7.87827 18 10ZM10 5C10.1989 5 10.3897 5.07902 10.5303 5.21967C10.671 5.36032 10.75 5.55109 10.75 5.75V10.25C10.75 10.4489 10.671 10.6397 10.5303 10.7803C10.3897 10.921 10.1989 11 10 11C9.80109 11 9.61032 10.921 9.46967 10.7803C9.32902 10.6397 9.25 10.4489 9.25 10.25V5.75C9.25 5.55109 9.32902 5.36032 9.46967 5.21967C9.61032 5.07902 9.80109 5 10 5ZM10 15C10.2652 15 10.5196 14.8946 10.7071 14.7071C10.8946 14.5196 11 14.2652 11 14C11 13.7348 10.8946 13.4804 10.7071 13.2929C10.5196 13.1054 10.2652 13 10 13C9.73478 13 9.48043 13.1054 9.29289 13.2929C9.10536 13.4804 9 13.7348 9 14C9 14.2652 9.10536 14.5196 9.29289 14.7071C9.48043 14.8946 9.73478 15 10 15Z" 
        fill="var(--ifm-note-warning-color)"/>
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

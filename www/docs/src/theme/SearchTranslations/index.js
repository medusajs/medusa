import {translate} from '@docusaurus/Translate';
import translations from '@theme-original/SearchTranslations';

const changedTranslations = {
  ...translations,
  placeholder: translate({
    id: 'theme.SearchModal.placeholder',
    message: 'Find something',
    description: 'The placeholder of the input of the DocSearch pop-up modal',
  }),
};
export default changedTranslations;

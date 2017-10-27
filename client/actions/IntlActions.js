import { SWITCH_LANGUAGE } from 'constants/actionTypes';

import { localizationData } from 'i18n/setup';

export function switchLanguage(newLang) {
  return {
    type: SWITCH_LANGUAGE,
    ...localizationData[newLang],
  };
}

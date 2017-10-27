import { SWITCH_LANGUAGE } from 'constants/actionTypes';
import { switchLanguage } from 'actions/IntlActions';
import { localizationData, enabledLanguages } from 'i18n/setup';

import intlReducer from 'reducers/IntlReducer';

describe('Intl Reducer', () => {
  //

  // ==============================================
  // JUST HOW DO YOU GO ABOUT TESTING FOR THIS ????
  // ==============================================
  // const initLocale = global.navigator && global.navigator.language || 'en';

  test('returns the default state if action is not found', () => {
    const result = intlReducer(undefined, 'invalid');
    expect(result).toEqual({ locale: 'en', enabledLanguages, ...localizationData.en });
  });

  test('returns the given state state if action is not found', () => {
    const result = intlReducer(true, 'invalid');
    expect(result).toEqual(true);
  });

  test('and it switches between languages', () => {
    // switchLanguage('en');
    let result = intlReducer(undefined, { type: SWITCH_LANGUAGE, ...localizationData['en'] });
    expect(result).toEqual({ locale: 'en', enabledLanguages, ...localizationData.en });

    // switchLanguage('de');
    result = intlReducer(undefined, { type: SWITCH_LANGUAGE, ...localizationData['de'] });
    expect(result).toEqual({ locale: 'de', enabledLanguages, ...localizationData.de });
  });

  //
});

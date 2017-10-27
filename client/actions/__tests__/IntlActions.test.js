import { SWITCH_LANGUAGE } from 'constants/actionTypes';
import { switchLanguage, } from 'actions/IntlActions';

// import the localization to check whats written
import { localizationData } from 'i18n/setup';

describe('Intl Actions', () => {
  //
  test('should return default for locale of undefined', () => {
    const result = switchLanguage(undefined);
    expect(result).toBeDefined();
    expect(result.type).toBeDefined();
    expect(result.type).toEqual(SWITCH_LANGUAGE);
  });

  test('should return default for locale of null', () => {
    const result = switchLanguage(null);
    expect(result).toBeDefined();
    expect(result.type).toBeDefined();
    expect(result.type).toEqual(SWITCH_LANGUAGE);
  });

  test('should return the correct type for locale "en"', () => {
    const lang = 'en';
    const result = switchLanguage(lang);

    expect(result).toBeDefined();
    expect(result.type).toBeDefined();
    expect(result.type).toEqual(SWITCH_LANGUAGE);
    expect(result).toEqual({ type: SWITCH_LANGUAGE, ...localizationData[lang] });
  });

  test('should return the correct type for locale "de"', () => {
    const lang = 'de';
    const result = switchLanguage(lang);

    expect(result).toBeDefined();
    expect(result.type).toBeDefined();
    expect(result.type).toEqual(SWITCH_LANGUAGE);
    expect(result).toEqual({ type: SWITCH_LANGUAGE, ...localizationData[lang] });
  });

  // test('should return the default for unknown locale', () => {
  //   const lang = 'ru';
  //   const result = switchLanguage(lang);

  //   expect(result).toBeDefined();
  //   expect(result.type).toBeDefined();
  //   expect(result.type).toEqual(SWITCH_LANGUAGE);
  //   expect(result).toEqual({ type: SWITCH_LANGUAGE, ...localizationData['en'] });
  // });
  //
});

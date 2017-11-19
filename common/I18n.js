import I18n from 'react-native-i18n';
import en from '../languages/en';
import zh from '../languages/zh';
import ja from '../languages/ja';

I18n.defaultLocale = 'en';
I18n.fallbacks = true;
I18n.translations = {
    en,
    zh,
    ja,
};

export {I18n};

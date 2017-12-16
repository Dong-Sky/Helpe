import I18n from 'react-native-i18n';
import en from '../languages/en';
import zh from '../languages/zh';
import ja from '../languages/ja';

<<<<<<< Updated upstream
I18n.defaultLocale = 'en';
I18n.fallbacks = true;
I18n.translations = {
    en,
    zh,
    ja,
=======
I18n.defaultLocale = 'ja';
I18n.fallbacks = true;
I18n.translations = {
    //en,
    ja,
    zh,

>>>>>>> Stashed changes
};

export {I18n};

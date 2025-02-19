import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en";
import zh_tw from "./zh_tw";
import zh from "./zh";

const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
  "zh-TW": {
    translation: zh_tw,
  },
};

const storedLang = localStorage.getItem('lang') || 'system';
// 根据存储的语言设置初始化i18n
const getSystemLanguage = () => navigator.language.startsWith('zh') ? 'zh' : 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: storedLang === 'system' ? getSystemLanguage() : storedLang, // 根据存储值初始化语言
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

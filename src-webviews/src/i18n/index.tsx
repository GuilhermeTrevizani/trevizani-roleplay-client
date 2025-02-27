import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import translationPortugueBrazilian from "./ptbr.json";

export const stringFormat = (str: string, ...args: any[]) =>
  str.replace(/{(\d+)}/g, (match, index) => args[index] || '')

const resources = {
  ptbr: {
    translation: translationPortugueBrazilian,
  },
}

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: "ptbr",
  });

export default i18next;
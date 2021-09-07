import { setCookie, parseCookies } from "nookies";

export const locales = ["en", "ko"];

export const getLocale = () => {
  if (typeof window === "undefined") {
    return null;
  }
  const storageLocale = localStorage.getItem("locale");
  const navLocale = window.navigator.language.substring(0, 2);
  const defaultLocale = "en";
  return storageLocale || navLocale || defaultLocale;
};

export const getNextLocale = () => {
  const currentLocale = getLocale();
  const nextLocale =
    locales[(locales.indexOf(currentLocale) + 1) % locales.length];
  return nextLocale;
};

export const setLocale = (locale) => {
  if (!locale) {
    return;
  }
  const cookies = parseCookies();
  if (locale === cookies.locale) {
    return;
  }
  localStorage.setItem("locale", locale);
  setCookie(null, "blog-lang", locale, {
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
};

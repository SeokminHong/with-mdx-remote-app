import { setCookie, parseCookies } from "nookies";

export const locales = ["en", "ko"] as const;
export const defaultLocale = "en";
export type Locale = typeof locales[number];

export function isLocale(l: string): l is Locale {
  return (locales as readonly string[]).includes(l);
}

export const getLocale = () => {
  if (typeof window === "undefined") {
    return null;
  }
  const storageLocale = localStorage.getItem("locale");
  // e.g. en-US -> en
  const navLocale = window.navigator.language.substring(0, 2);
  const userLocale = storageLocale || navLocale;
  if (isLocale(userLocale)) {
    return userLocale;
  }
  return defaultLocale;
};

export const getNextLocale = () => {
  const currentLocale = getLocale();
  if (!currentLocale) {
    return null;
  }
  const nextLocale =
    locales[(locales.indexOf(currentLocale) + 1) % locales.length];
  return nextLocale;
};

export const setLocale = (locale: Locale | null) => {
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

import { getLocale, setLocale } from "../utils/locale";

// Initialize the locale
setLocale(getLocale());

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

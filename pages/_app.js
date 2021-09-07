import { getLocale, setLocale } from "../utils/locale";

setLocale(getLocale());

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

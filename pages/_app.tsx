import { AppProps } from 'next/app';

import { getLocale, setLocale } from '../utils/locale';

// Initialize the locale
setLocale(getLocale());

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

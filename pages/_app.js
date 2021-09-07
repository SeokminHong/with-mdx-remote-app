import { setCookie } from 'nookies';

setCookie(null, 'my-lang', 'ko', {
  maxAge: 30 * 24 * 60 * 60,
  path: '/',
});

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

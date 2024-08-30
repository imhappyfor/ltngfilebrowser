import type { AppProps } from 'next/app';
import '../styles/globals.css'; // Make sure this path is correct

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
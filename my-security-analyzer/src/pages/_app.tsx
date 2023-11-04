// src/pages/_app.tsx
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import type { AppProps } from 'next/app';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;

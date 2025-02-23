// src/pages/_app.tsx
import '@/app/globals.css'; // Adjust the path if necessary
import type { AppProps } from 'next/app';
import { Toaster } from 'sonner'; // Import the Toaster component from sonner
import 'promise.withresolvers';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster position="top-center" richColors /> {/* Add the Toaster component */}
    </>
  );
}

export default MyApp;
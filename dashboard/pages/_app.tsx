import { NextIntlProvider } from "next-intl";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, messages, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <NextIntlProvider messages={messages}>
        <Component {...pageProps} />
      </NextIntlProvider>
    </SessionProvider>
  );
}

export default MyApp;

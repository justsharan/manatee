import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";

import "styles/globals.css";

export default appWithTranslation(
  ({ Component, pageProps: { session, ...pageProps } }) => (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
);

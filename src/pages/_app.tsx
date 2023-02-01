import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider, getSession } from "next-auth/react";
import {
  NextUIProvider,
  createTheme,
  globalCss,
  gray,
} from "@nextui-org/react";

import { api } from "../utils/api";

const globalStyles = globalCss({
  body: { margin: 0, background: "$gray200" },
});

const myDarkTheme = createTheme({
  type: "dark",
  theme: {
    colors: {
      // brand colors
      background: "##0560a5",
      text: "#fff",
      // you can also create your own color
      myDarkColor: "#610746",
      // ...  more colors
    },
    space: {},
    fonts: {},
  },
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  globalStyles();
  return (
    <SessionProvider session={session}>
      <NextUIProvider theme={myDarkTheme}>
        <Component {...pageProps} />
      </NextUIProvider>
    </SessionProvider>
  );
};

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    session: await getSession(ctx),
  };
};

export default api.withTRPC(MyApp);

import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Space_Grotesk } from "@next/font/google";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { Layout } from "src/components/layout";

const MyApp: AppType<{ session: Session | null; withoutNavbar: boolean }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main className={`${spaceGrotesk.variable} min-h-screen font-sans`}>
        <Layout withoutNavbar={pageProps.withoutNavbar}>
          <Component {...pageProps} />
        </Layout>
      </main>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);

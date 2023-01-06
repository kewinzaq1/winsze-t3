import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Hero } from "src/components/Hero";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/feed");
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>Winsze t3</title>
        <meta name="description" content="Winsze t3" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
    </>
  );
};

export default Home;

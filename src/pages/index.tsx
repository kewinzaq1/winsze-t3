import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { CreatePost } from "src/components/feed/post/CreatePost";
import { Posts } from "src/components/feed/post/Posts";
import { UnauthHero } from "src/components/UnauthHero";
import { trpc } from "src/utils/trpc";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <>
        <Head>
          <title>Create T3 App</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div>Loading...</div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {session ? (
        <>
          <CreatePost />
          <Posts />
        </>
      ) : (
        <UnauthHero />
      )}
    </>
  );
};

export default Home;

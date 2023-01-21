import Head from "next/head";
import Feed from "../components/Feed";
import Navigator from "../components/Navigator";
import Widgets from "../components/Widgets";
import { getProviders, getSession, useSession } from "next-auth/react";
import Modal from "../components/Modal";
import { editmodalState, modalState } from "../atoms/modalAtom";
import { useRecoilState } from "recoil";
import Login from "./auth/Login";

export default function Home({ trendingResults, followResults, providers }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);

  if (!session) return <Login providers={providers} />;

  return (
    <div className="">
      <Head>
        <title>Home / Twitter</title>
        <link rel = "icon" href = "https://rb.gy/brzhpg"
        type = "image/x-icon"/>
      </Head>

      <main className="flex max-w-[1500px] mx-auto bg-black min-h-screen ">
        <Navigator />
        <Feed />
        <Widgets
          trendingResults={trendingResults}
          followResults={followResults}
        />

        {isOpen && <Modal />}

      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const trendingResults = await fetch("https://www.jsonkeeper.com/b/GK5T").then(
    (res) => res.json()
  );
  const followResults = await fetch("https://www.jsonkeeper.com/b/KZN3").then(
    (res) => res.json()
  );
  const providers = await getProviders();
  const session = await getSession(context);

  return {
    props: {
      trendingResults,
      followResults,
      providers,
      session,
    },
  };
}

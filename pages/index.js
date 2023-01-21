import Head from "next/head";
import Feed from "../components/Feed";
import Navigator from "../components/Navigator";
import Widgets from "../components/Widgets";
import { getProviders, getSession, signIn, useSession } from "next-auth/react";
import Modal from "../components/Modal";
import { editmodalState, modalState } from "../atoms/modalAtom";
import { useRecoilState } from "recoil";
import Image from "next/image";

export default function Home({ trendingResults, followResults, providers }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);

  if (!session) return  <div className="flex flex-col items-center space-y-20 pt-48">
      <Image
        src="https://rb.gy/ogau5a"
        width={150}
        height={150}
      />

      <div>
     
      {Object?.values(providers)?.map((provider) => (
          <div key={provider.name}>
            {/* https://devdojo.com/tailwindcss/buttons#_ */}
            <button
              className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group"
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            >
              <span className="w-48 h-48 rounded rotate-[-40deg] bg-[#1d9bf0] absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
              <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
                Sign in with {provider.name}
              </span>
            </button>
          </div>
      
   
    ))}
   </div>
   </div>
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

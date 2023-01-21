import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "@firebase/firestore";
import { getProviders, getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";
import Modal from "../components/Modal";
import Navigator from "../components/Navigator";
import Widgets from "../components/Widgets";
import Post from "../components/Post";
import { db } from "../firebase";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import Comment from "../components/Comment";
import Head from "next/head";
import Image from "next/image";

function PostPage({ trendingResults, followResults, providers }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(
    () =>
      onSnapshot(doc(db, "posts", id), (snapshot) => {
        setPost(snapshot.data());
      }),
    [db]
  );

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db, id]
  );

  if (!session) return  <div className="flex flex-col items-center space-y-20 pt-48">
      <Image
        src="https://rb.gy/ogau5a"
        width={150}
        height={150}
      />

      <div>
     
            {/* https://devdojo.com/tailwindcss/buttons#_ */}
            <button
              className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group"
              onClick={() => signIn()}
            >
              <span className="w-48 h-48 rounded rotate-[-40deg] bg-[#1d9bf0] absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
              <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
                Sign in with Google
              </span>
            </button>
          </div>
          </div>
      


  return (
    <div>
      <Head>
        <title>
          {post?.username} on Twitter: "{post?.text}"
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Navigator />
        <div className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
          <div className="flex items-center px-1.5 py-2 border-b border-gray-700 text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-black">
            <div
              className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
              onClick={() => router.push("/")}
            >
              <ArrowLeftIcon className="h-5 text-white" />
            </div>
            Tweet
          </div>

          <Post id={id} post={post} postPage />
          {comments.length > 0 && (
            <div className="pb-72">
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  id={comment.id}
                  comment={comment.data()}
                />
              ))}
            </div>
          )}
        </div>
        <Widgets
          trendingResults={trendingResults}
          followResults={followResults}
        />

        {isOpen && <Modal />}
      </main>
    </div>
  );
}

export default PostPage;

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

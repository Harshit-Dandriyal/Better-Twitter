import { SparklesIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import MainInput from "./Input";
import { onSnapshot, collection, query, orderBy } from "@firebase/firestore";
import { db } from "../firebase";
import Post from "./Post";
import { useSession } from "next-auth/react";

function Feed() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);

  // MESSY
  // useEffect(() => {
  //   const unsubscribe = onSnapshot(
  //     query(collection(db, "posts"), orderBy("timestamp", "desc")),
  //     (snapshot) => {
  //       setPosts(snapshot.docs);
  //     }
  //   );

  //   return () => {
  //     unsubscribe();
  //   };
  // }, [db]);

  // CLEAN
  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
      ),
    [db]
  );

  return (
    <div className="flex-grow border-l border-r max-w-2xl sm:ml-[73px] xl:ml-[370px] border-gray-700 ">
      <div className="text-[#d9d9d9] flex items-center sm:justify-between px-3 sticky top-0 z-50 bg-black border-b border-gray-700 py-2 ">
        <h2 className="text-lg sm:text-xl font-bold">Home</h2>
        <div className="hoverAnimation w-9 h-9 flex justify-center xl:px-0 ml-auto items-center ">
          <SparklesIcon className="text-white h-5 " />
        </div>
      </div>
      <MainInput />
      <div className="pb-72">
        {posts.map((post) => (
          <Post key={post.id} id={post.id} post={post.data()} />
        ))}
      </div>
    </div>
  );
}

export default Feed;

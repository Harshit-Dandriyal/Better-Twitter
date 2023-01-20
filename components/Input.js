import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useRef, useState,useEffect } from "react";
import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
// const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import { useRecoilState } from "recoil";
import { editIdState, editState, editTweet, inputText, selectedImage } from "../atoms/modalAtom";

function MainInput() {
  const { data: session } = useSession();
  const [input, setInput] = useRecoilState(inputText);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] =  useRecoilState(selectedImage);
  const filePickerRef = useRef(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [editId, setEditId] = useRecoilState(editIdState);
  const [isEdit, setisEdit] = useRecoilState(editState);
  const [cursor, setCursor] = useState(null);
  const inputRef = useRef(null);
  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

if(!isEdit){
    const docRef = await addDoc(collection(db, "posts"), {
      id: session.user.uid,
      username: session.user.name,
      userImg: session.user.image,
      tag: session.user.tag,
      text: input,
      timestamp: serverTimestamp(),
      edited: false
    });
    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      });
    }
  }else {
    const docRef = doc(db, 'posts', editId);
    const updatePost = await updateDoc(docRef, {
      text: input,
      timestamp: serverTimestamp(),
      edited: true
  });
  const imageRef = ref(storage, `posts/${editId}/image`);
  if (selectedFile) {
    await uploadString(imageRef, selectedFile, "data_url").then(async () => {
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(db, "posts", docRef.id), {
        image: downloadURL,
      });
    });
  }
  setisEdit(false)
  }
 

    setLoading(false);
    setInput("");
    setSelectedFile(null);
    setShowEmojis(false);
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setInput(input + emoji);
  };
  const handleChange = (e) => {
    setInput(e.target.value)
    setCursor(e.target.selectionStart);

 };
 useEffect(() => {
  const input = inputRef.current;
  if (input) input.setSelectionRange(cursor, cursor);
}, [inputRef, cursor, input]);
  return (
    <div
      className={`border-b overflow-y-scroll scrollbar-hide p-3 flex space-x-3  border-gray-700  ${
        loading && "opacity-60"
      }`}
    >
      {/* <img
        src={session.user.image}
        alt=""
        className="h-11 w-11 rounded-full cursor-pointer"
        onClick={signOut}
      /> */}
      <div className="divide-gray-700 w-full divide-y ">
        <div className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}>
          <textarea
          ref={inputRef}
            value={input}
            onChange={handleChange}
            placeholder="What's happening?"
            rows="2"
            className="bg-transparent outline-none placeholder-gray-500 tracking-wide w-full min-h-[50px] text-[#d9d9d9] text-lg "
          />

          {selectedFile && (
            <div className="relative">
              <div
                className="absolute w-8 h-8 bg-[#15181c] items-center justify-center top-1 left-1 cursor-pointer hover:bg-[#272c26] bg-opacity-75 rounded-full flex "
                onClick={() => setSelectedFile(null)}
              >
                <XIcon className="text-white h-5" />
              </div>
              <img
                src={selectedFile}
                alt=""
                className="rounded-2xl max-h-80 object-contain"
              />
            </div>
          )}
        </div>
        {!loading && (
          <div className="flex items-center justify-between pt-2.5">
            <div className="flex items-center">
              <div
                className="icon"
                onClick={() => filePickerRef.current.click()}
              >
                <PhotographIcon className="text-[#1d9bf0] h-[22px]" />
                <input
                  type="file"
                  ref={filePickerRef}
                  hidden
                  onChange={addImageToPost}
                />
              </div>

              <div className="icon rotate-90">
                <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
              </div>

              <div className="icon" onClick={() => setShowEmojis(!showEmojis)}>
                <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
              </div>

              <div className="icon">
                <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
              </div>

              {showEmojis && (
                <Picker
                  onSelect={addEmoji}
                  style={{
                    position: "absolute",
                    marginTop: "465px",
                    marginLeft: -40,
                    maxWidth: "320px",
                    borderRadius: "20px",
                  }}
                  theme="dark"
                />
              )}
            </div>
            <button
              className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
              disabled={!input && !selectedFile}
              onClick={sendPost}
            >
             {isEdit? "Edit Tweet": "Tweet"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainInput;

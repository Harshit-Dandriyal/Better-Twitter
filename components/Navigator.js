import Image from "next/image";
import { HomeIcon } from "@heroicons/react/solid";
import {
  HashtagIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  ClipboardListIcon,
  UserIcon,
  DotsCircleHorizontalIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/outline";
import NavigatorTab from "./NavigatorTab";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

function Navigator() {
  const { data: session } = useSession();

  return (
    <div className="hidden sm:flex flex-col items-center xl:items-start xl:w-[340px] p-2 fixed h-full">
      <div className="flex items-center justify-center w-14 h-14 hoverAnimation p-0 xl:ml-24">
        <Image src="https://rb.gy/ogau5a" width={30} height={30} />
      </div>
      <div className="space-y-2.5 mt-4 mb-2.5 xl:ml-24">
        <NavigatorTab text="Home" Icon={HomeIcon} active />
        <NavigatorTab text="Explore" Icon={HashtagIcon} />
        <NavigatorTab text="Notifications" Icon={BellIcon} />
        <NavigatorTab text="Messages" Icon={InboxIcon} />
        <NavigatorTab text="Bookmarks" Icon={BookmarkIcon} />
        <NavigatorTab text="Lists" Icon={ClipboardListIcon} />
        <NavigatorTab text="Profile" Icon={UserIcon} />
        <NavigatorTab text="More" Icon={DotsCircleHorizontalIcon} />
      </div>
      <button className="hidden xl:inline ml-auto bg-[#1d9bf0] text-white text-lg font-bold shadow-md hover:bg-[#1a8cd8] rounded-full w-56 h-[52px] ">
        Tweet
      </button>
      <div
        className="text-[#d9d9d9] hoverAnimation xl:ml-auto xl:-mr-5 flex items-center justify-center mt-auto "
        onClick={signOut}
      >
        {/* <img
          src={session.user.image}
          alt=""
          className="h-10 w-10 rounded-full xl:mr-2.5"
        /> */}
        <div className="hidden xl:inline leading-5">
          <h4 className="font-bold">gfdgfd</h4>
          <p className="text-[#6e767d]">gfgfd</p>
        </div>
        <DotsHorizontalIcon className="h-5 hidden xl:inline ml-10" />
      </div>
    </div>
  );
}

export default Navigator;

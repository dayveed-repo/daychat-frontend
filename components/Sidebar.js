import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import Chat from "./Chat";
import { useDispatch, useSelector } from "react-redux";
import { getchats } from "../reduxKit/reducer";
import { IoMdCreate } from "react-icons/io";
import { useRouter } from "next/router";
import Fuse from "fuse.js";
import instance from "../axiosConfig";

const Sidebar = ({ socket }) => {
  const dispatch = useDispatch();
  const [filteredChats, setfilteredChats] = useState([]);

  const { chats, usersOnline, currentUser } = useSelector((state) => state.app);
  const router = useRouter();

  const options = {
    includeScore: true,
    keys: ["chatInfo.username"],
  };

  const handleSeaarchChange = (e) => {
    const fuse = new Fuse(chats, options);
    const result = fuse.search(e.target.value);

    setfilteredChats(result);
  };

  const sortedChats = () => {
    if (!chats) return [];

    if (!currentUser.pinned_chats.length) return chats;

    const pinnedChats = chats.filter((chat) =>
      currentUser.pinned_chats.includes(chat?.doc?._id)
    );
    const unPinnedChats = chats.filter(
      (chat) => !currentUser.pinned_chats.includes(chat?.doc?._id)
    );

    return [...pinnedChats, ...unPinnedChats];
  };

  const checkUserStatus = (userId) => {
    if (!userId) return false;

    const foundUser = usersOnline.find(
      (user) => user.currentUser.user_id === userId
    );

    if (foundUser) return true;
    return false;
  };

  const checkUnreadMessages = (unreadMessages) => {
    if (!unreadMessages) return 0;
    if (!unreadMessages.length) return 0;

    const finalUnread = unreadMessages.filter(
      (message) => message.sender_id !== currentUser.user_id
    );

    return finalUnread.length;
  };

  const checkChatsUnread = () => {
    let count = 0;

    if (!chats) return 0;

    chats.forEach((chat) => {
      if (checkUnreadMessages(chat?.unreadMessages) > 0) {
        count += 1;
      }
    });

    return count;
  };

  useEffect(() => {
    let token = window.localStorage.getItem("authUser");

    const fetchChats = async () => {
      const userChats = await instance
        .get(`/chats?token=${token}`)
        .catch((err) => {
          if (err.response) return console.log(err.response.data);
          return console.log("No internet connection");
        });

      if (userChats) dispatch(getchats(userChats.data.chats));
      return;
    };

    fetchChats();
  }, []);

  return (
    <div
      className={`${
        router.asPath == "/chat" ? "hidden md:flex" : "flex"
      } w-full md:w-4/12 lg:w-3/12 h-full px-3 flex-col`}
    >
      <div className="flex items-center">
        <div className="flex-grow bg-white flex items-center rounded-2xl px-3 py-1 focus-within:shadow-lg">
          <input
            type="text"
            onChange={(e) => handleSeaarchChange(e)}
            className="bg-transparent outline-none flex-grow mr-2"
            placeholder="Search"
          />
          <AiOutlineSearch className="text-green-700" />
        </div>

        <div
          onClick={() => router.push("/", "/newChat", { shallow: true })}
          className="w-8 h-8 ml-3 flex items-center justify-center rounded-lg cursor-pointer shadow-lg bg-green-500"
        >
          <IoMdCreate className="text-center text-white" />
        </div>
      </div>

      <div className="mt-4 px-3">
        <h3 className="text-green-800 font-medium">
          Chats ({checkChatsUnread()})
        </h3>
      </div>

      {filteredChats.length ? (
        <div className="mt-2 bg-white flex-grow max-h-[72vh] overflow-y-scroll rounded-xl p-2">
          {filteredChats.map((chat) => (
            <Chat
              key={chat?.item?.doc?._id}
              name={chat?.item?.chatInfo?.username}
              socket={socket}
              avatar={chat?.item?.chatInfo?.avatar}
              recent_message={chat?.item?.doc?.recent_message}
              last_update={chat?.item?.doc?.recent_message?.sent_on}
              id={chat?.item?.doc?._id}
              isOnline={checkUserStatus(chat?.item?.chatInfo?._id)}
              reciever={chat?.item?.chatInfo?._id}
              unread={checkUnreadMessages(chat?.item?.unreadMessages)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-2 bg-white flex-grow max-h-[72vh] overflow-y-scroll rounded-xl p-2">
          {chats && chats?.length ? (
            sortedChats().map((chat) => (
              <Chat
                key={chat?.doc?._id}
                name={chat?.chatInfo?.username}
                socket={socket}
                recent_message={chat?.doc?.recent_message}
                last_update={chat?.doc?.recent_message?.sent_on}
                id={chat?.doc?._id}
                avatar={chat?.chatInfo?.avatar}
                isOnline={checkUserStatus(chat?.chatInfo?._id)}
                reciever={chat?.chatInfo?._id}
                isPinned={currentUser?.pinned_chats?.includes(chat?.doc?._id)}
                unread={checkUnreadMessages(chat?.unreadMessages)}
              />
            ))
          ) : chats && !chats.length ? (
            <h4 className="text-center text-slate-500 text-xs font-medium">
              No Chats Yet
            </h4>
          ) : (
            <p className="text-center text-slate-500 text-xs font-medium animate-pulse">
              Loading chats...
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;

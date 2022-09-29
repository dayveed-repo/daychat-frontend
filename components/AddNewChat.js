import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiOutlineRight, AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { changeChat } from "../reduxKit/reducer";
import instance from "../axiosConfig";

const AddNewChat = () => {
  const [input, setinput] = useState("");
  const [error, seterror] = useState(null);
  const [result, setresult] = useState(null);
  const router = useRouter();

  const { chats, currentUser } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  const SearchUser = async () => {
    if (!input.length) return;
    seterror(null);
    setresult(null);

    const response = await instance
      .post("/user", { email: input })
      .catch((err) => {
        if (!err.response) return seterror("No internet");
        return seterror(err.response.data.message);
      });

    setresult(response.data);
  };

  const GotoChat = () => {
    router.push("/", "/chat", { shallow: true });

    if (result?.user._id === currentUser.userId) return;

    const existingChat = chats.find(
      (chat) => chat?.chatInfo?._id === result.user._id
    );

    if (existingChat)
      return dispatch(
        changeChat({
          id: existingChat?.doc?._id,
          last_update: existingChat.doc?.recent_message?.sent_on,
          name: existingChat?.chatInfo.username,
          reciever: existingChat?.chatInfo._id,
        })
      );

    return dispatch(
      changeChat({
        id: "newChat",
        name: result.user?.username,
        reciever: result.user._id,
        userInfo: result.user,
      })
    );
  };

  return (
    <div className="fixed w-screen h-screen backdrop-blur-sm z-30">
      <div className="bg-white shadow-md w-11/12 mt-20 mx-auto max-w-lg p-3">
        <AiOutlineClose
          onClick={() => router.push("/", "/", { shallow: true })}
          className="ml-auto text-lg text-gray-600 hover:text-red-500 cursor-pointer"
        />

        <div className="mt-5 mb-10 flex flex-col items-center">
          <h2 className="text-gray-500 font-semibold">Start New Chat</h2>
          <p className="text-xs text-slate-500">
            Enter the correct email of an existing user to send message
          </p>
        </div>

        <div className="flex items-center space-x-2 w-11/12 mx-auto">
          <input
            type="email"
            value={input}
            onChange={(e) => setinput(e.target.value)}
            className="bg-green-100 border-2 border-green-500 rounded-sm outline-none px-3 py-1 flex-grow focus-within:bg-transparent"
            placeholder="Enter user's email"
          />
          <button
            onClick={() => SearchUser()}
            className="text-sm text-gray-600 bg-slate-300 px-4 py-2 rounded-lg"
          >
            Search
          </button>
        </div>

        {error ? (
          <p className="text-red-600 text-xs mt-5 ml-10">{error}</p>
        ) : result ? (
          <p className="text-gray-400 mt-5 text-xs ml-10">
            {result.user ? `user - ${result.user.username}` : "No User Found"}
          </p>
        ) : (
          <p></p>
        )}

        <button
          disabled={!result?.user || result?.user._id === currentUser.user_id}
          onClick={() => GotoChat()}
          className={`flex items-center text-sm w-max ml-auto ${
            !result?.user || result?.user._id === currentUser.user_id
              ? "opacity-50"
              : ""
          } bg-green-500 text-white space-x-2 mt-10 mb-5 px-4 py-2 rounded-lg cursor-pointer`}
        >
          <h4>Continue</h4>
          <AiOutlineRight />
        </button>
      </div>
    </div>
  );
};

export default AddNewChat;

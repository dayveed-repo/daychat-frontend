import { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { RiSendPlaneFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  addChat,
  addMessage,
  changeChat,
  clearChat,
  failedMessage,
  getMessages,
  sentMessage,
  togglePinChat,
} from "../reduxKit/reducer";
import Message from "./Message";
import { AiFillPushpin } from "react-icons/ai";
import { BiBlock } from "react-icons/bi";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { BigHead } from "@bigheads/core";
import { useRouter } from "next/router";
import { MdArrowBackIosNew } from "react-icons/md";
import instance from "../axiosConfig";

const ChatAvatar = ({ avatar }) => {
  return (
    <div className="h-12 w-14 flex items-center justify-center">
      {avatar ? (
        <BigHead
          accessory={avatar?.accessory}
          body={avatar?.body}
          circleColor="blue"
          clothing={avatar?.clothing}
          clothingColor={avatar?.clothingColor}
          eyebrows={avatar?.eyebrows}
          eyes={avatar?.eyes}
          facialHair={avatar?.facialHair}
          graphic="react"
          hair={avatar?.hair}
          hairColor={avatar?.hairColor}
          hat={avatar?.hat}
          hatColor={avatar?.hatColor}
          lashes={avatar?.lashes}
          lipColor={avatar?.lipColor}
          mask="false"
          mouth={avatar?.mouth}
          skinTone={avatar?.skinTone}
        />
      ) : (
        <BigHead
          accessory="none"
          body="chest"
          circleColor="blue"
          clothing="naked"
          clothingColor="black"
          eyebrows="raised"
          eyes="normal"
          facialHair="none"
          graphic="react"
          hair="none"
          hairColor="black"
          hat="none"
          hatColor="black"
          lashes="false"
          lipColor="red"
          mask="false"
          mouth="grin"
          skinTone="brown"
        />
      )}
    </div>
  );
};

const AppBody = ({ socket }) => {
  const boardRef = useRef();
  const [input, setinput] = useState("");
  const [error, seterror] = useState(null);
  const [showChatActions, setShowChatActions] = useState(false);
  const [showEmoji, setshowEmoji] = useState(false);

  const dispatch = useDispatch();
  const { currentChat, currentUser, messages, usersOnline } = useSelector(
    (state) => state.app
  );
  const router = useRouter();

  const getUserOnline = (userId, message, chat) => {
    if (!userId) return;

    const foundUser = usersOnline.find(
      (user) => user.currentUser.user_id === userId
    );

    if (foundUser) {
      socket.emit("newMessageToUser", {
        socketId: foundUser.socketId,
        message,
        chat,
      });
    }

    return foundUser;
  };

  const handleSendMessage = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!input.length) return;

    setinput("");
    let token = window.localStorage.getItem("authUser");
    boardRef.current.scrollIntoView({ behavior: "smooth" });

    if (currentChat.id === "newChat") {
      const newChat = await instance
        .post(`/chat?token=${token}`, {
          users: [currentUser.user_id, currentChat.reciever],
        })
        .catch((err) => {
          if (err?.response) return alert("No internet Connection");
          return console.log(err.response.data?.message);
        });

      if (newChat?.data?.chat) {
        socket.emit("Joined", newChat.data.chat._id);

        dispatch(
          changeChat({
            id: newChat.data.chat._id,
            last_update: Date.now(),
            name: currentChat.name,
            reciever: currentChat.reciever,
            userInfo: currentChat.userInfo,
          })
        );

        dispatch(
          addMessage({
            chatId: newChat.data.chat._id,
            message: { message: input, status: "pending", id: messages.length },
          })
        );

        await instance
          .post(`/chat/${newChat.data.chat._id}/message?token=${token}`, {
            reciever_id: currentChat.reciever,
            message: input,
          })
          .then((res) => {
            socket.emit("message", {
              message: res.data.message,
              sender: currentUser,
              chatId: newChat.data.chat._id,
            });

            getUserOnline(
              currentChat.reciever,
              res.data.message,
              newChat.data.chat
            );

            dispatch(
              addChat({
                doc: {
                  ...newChat.data.chat,
                  recentMessage: res.data.message,
                  last_message_at: Date.now(),
                },
                chatInfo: currentChat.userInfo,
              })
            );

            return dispatch(
              sentMessage({
                chatId: newChat.data.chat._id,
                initial: { message: input, _id: messages.length },
                message: res.data.message,
              })
            );
          })
          .catch((err) => {
            return dispatch(
              failedMessage({
                chatId: newChat.data.chat._id,
                message: { message: input, _id: messages.length },
              })
            );
          });

        return;
      } else {
        return console.log("An error occured");
      }
    }

    dispatch(
      addMessage({
        chatId: currentChat.id,
        message: { message: input, status: "pending", id: messages.length },
      })
    );

    await instance
      .post(`/chat/${currentChat.id}/message?token=${token}`, {
        reciever_id: currentChat.reciever,
        message: input,
      })
      .then((res) => {
        socket.emit("message", {
          message: res.data.message,
          sender: currentUser,
          chatId: currentChat.id,
        });

        return dispatch(
          sentMessage({
            chatId: currentChat.id,
            initial: { message: input, _id: messages.length },
            message: res.data.message,
          })
        );
      })
      .catch((err) => {
        return dispatch(
          failedMessage({
            chatId: currentChat.id,
            message: { message: input, _id: messages.length },
          })
        );
      });
  };

  const checkUserStatus = (userId) => {
    if (!userId) return false;

    const foundUser = usersOnline.find(
      (user) => user.currentUser.user_id === userId
    );

    if (foundUser) return true;
    return false;
  };

  const clearChatMessages = async () => {
    seterror(null);
    let token = window.localStorage.getItem("authUser");

    if (currentChat.id === "newChat") return;

    const deleted = await instance
      .get(`/chat/${currentChat.id}/clear?token=${token}`)
      .catch((err) => {
        if (err.response) return seterror(err.response.data?.message);
        return seterror("No Internet Connection");
      });

    if (deleted) {
      return dispatch(clearChat({ chatId: currentChat.id }));
    }

    return;
  };

  const handlePinChat = async () => {
    if (currentChat.id === "newChat") return;
    let token = window.localStorage.getItem("authUser");

    await instance
      .get(`/chat/${currentChat.id}/pinChat?token=${token}`)
      .then((_) => {
        return dispatch(togglePinChat(currentChat.id));
      })
      .catch((err) => {
        return;
      });

    return;
  };

  function selectEmoji(emojiData) {
    let sym = emojiData.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));

    let emoji = String.fromCodePoint(...codesArray);

    setinput(input + emoji);
  }

  useEffect(() => {
    if (!currentChat) return;
    let token = window.localStorage.getItem("authUser");

    const fetchChatMesages = async () => {
      if (messages[currentChat.id]) return console.log("prensent");

      const fetchedMessages = await instance
        .get(`/chat/${currentChat.id}/message?token=${token}`)
        .catch((err) => {
          return console.log(err.response.data);
        });

      if (!fetchedMessages) return;
      return dispatch(
        getMessages({
          chatId: currentChat.id,
          messages: fetchedMessages.data.messages,
        })
      );
    };

    fetchChatMesages();
  }, [currentChat]);

  if (!currentChat)
    return (
      <div
        className={`${
          router.asPath != "/chat" && "hidden md:flex"
        } flex-grow max-h-[75vh] flex items-center justify-center`}
      >
        <p>Select a chat to begin messageing</p>
      </div>
    );

  return (
    <div
      className={`${
        router.asPath != "/chat" && "hidden md:flex md:flex-col"
      } relative flex-grow max-h-[75vh] px-3 md:px-5`}
    >
      <div className="flex items-center">
        <MdArrowBackIosNew
          onClick={() => router.push("/", "/", { shallow: true })}
          className="md:hidden text-gray-600 cursor-pointer text-lg"
        />

        <ChatAvatar avatar={currentChat?.avatar} />

        <div className="flex-grow">
          <h2 className="sm:text-lg text-gray-600">{currentChat?.name}</h2>
          {checkUserStatus(currentChat.reciever) ? (
            <p className="text-[10px] text-green-600">Online</p>
          ) : (
            <p className="text-[10px] text-gray-500">offline</p>
          )}
        </div>

        {currentChat.id != "newChat" && (
          <div className="relative flex items-center space-x-2 sm:space-x-5">
            <h3 onClick={() => clearChatMessages()} className="ChatAction">
              Clear Chat
            </h3>

            <h3
              onClick={() => setShowChatActions(!showChatActions)}
              className="ChatAction"
            >
              More
            </h3>

            <div
              className={`${
                showChatActions ? "absolute" : "hidden"
              } w-full right-0 shadow-lg top-10 bg-white rounded-md`}
            >
              <h4
                onClick={() => handlePinChat()}
                className="px-2 py-2 flex items-center text-slate-600 text-xs hover:bg-gray-200 cursor-pointer"
              >
                <AiFillPushpin />{" "}
                {currentUser?.pinned_chats?.includes(currentChat?.id)
                  ? "Unpin Chat"
                  : "Pin Chat"}
              </h4>

              <h4 className="px-2 py-2 text-red-400 flex items-center text-xs hover:bg-gray-200 cursor-pointer">
                <BiBlock /> Block Chat
              </h4>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col h-full bg-white mt-3">
        <div className="flex-grow max-h-[65vh] overflow-y-scroll pb-20 pt-5 px-1 sm:px-3">
          {!messages[currentChat.id]?.length ? (
            <div className="w-full flex justify-center">
              <h3 className="text-slate-500 text-xs font-medium animate-pulse">
                Send a message to {currentChat?.name}, to start conversation
              </h3>
            </div>
          ) : (
            messages[currentChat.id]?.map((message) =>
              !message.status ? (
                <Message
                  sent={message.sender_id === currentUser.user_id}
                  message={message.message}
                  timestamp={message.sent_on}
                  key={message?._id}
                />
              ) : (
                <Message
                  key={message?._id}
                  message={message.message}
                  status={message.status}
                />
              )
            )
          )}
          <div ref={boardRef}></div>
        </div>

        {showEmoji && (
          <div className="w-max absolute top-[10%] left-[20%]">
            <EmojiPicker
              onEmojiClick={selectEmoji}
              autoFocusSearch={false}
              theme={Theme.AUTO}
              width={300}
              height={350}
              emojiStyle="google"
            />
          </div>
        )}

        <div className="flex items-center px-3 pb-2 max-w-5xl w-full">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center flex-grow px-3 rounded-2xl bg-slate-200 py-2 mr-3"
          >
            <BsEmojiSmile
              onClick={() => setshowEmoji(!showEmoji)}
              className="text-2xl cursor-pointer hover:text-green-500 text-gray-800"
            />
            <input
              type="text"
              value={input}
              onChange={(e) => setinput(e.target.value)}
              placeholder="send message"
              className="outline-none flex-grow items-center mx-4 bg-transparent"
            />
            <ImAttachment className="text-lg cursor-pointer hover:text-green-500 text-gray-800" />
          </form>

          <div
            onClick={() => handleSendMessage()}
            className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg bg-green-400"
          >
            <RiSendPlaneFill className="text-white text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppBody;

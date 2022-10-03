import Head from "next/head";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AppBody from "../components/AppBody";
import NotificationBar from "../components/NotificationBar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  addUnReadMessage,
  getchats,
  getUsersOnline,
  login,
} from "../reduxKit/reducer";
import AddNewChat from "../components/AddNewChat";
import LoadingScreen from "../components/LoadingScreen";
import instance from "../axiosConfig";

const socket = io("ws://daychat.herokuapp.com", {
  transports: ["websocket"],
});

const Home = () => {
  const router = useRouter();
  const [loading, setloading] = useState(true);
  const [newMessage, setnewMessage] = useState(null);
  const [newChat, setnewChat] = useState(null);
  const [showNotification, setshowNotification] = useState(false);
  const [notificationInfo, setnotificationInfo] = useState(null);

  const dispatch = useDispatch();
  const { chats, currentUser, currentChat } = useSelector((state) => state.app);

  const checkUnread = async (chatId, message) => {
    if (!(chatId && message)) return;

    let token = window.localStorage.getItem("authUser");

    if (chatId === currentChat?.id) {
      const res = await instance.get(
        `/message/${message._id}/read?token=${token}`
      );

      if (!res?.data) return console.log("An Error Occured");
      return;
    } else {
      dispatch(addUnReadMessage({ chatId, message }));
    }
  };

  const handleNotification = (info) => {
    setnotificationInfo(null);
    setshowNotification(true);

    setTimeout(() => {
      return setshowNotification(false);
    }, 3000);

    return setnotificationInfo(info);
  };

  const stackAnimation = (id) => {
    const chat = chats?.find((chat) => chat.doc._id == id);
    if (!chat) return;

    const filteredChats = chats.filter((chat) => chat.doc._id != id);
    dispatch(getchats([chat, ...filteredChats]));

    if (newMessage.message.sender_id === currentUser.user_id) return;

    handleNotification(`New Message from ${newMessage.sender.username}`);

    dispatch(
      addMessage({ chatId: newMessage.chatId, message: newMessage.message })
    );

    checkUnread(newMessage.chatId, newMessage.message);
  };

  const getChatInfo = async (data) => {
    let token = window.localStorage.getItem("authUser");

    const fetchedChat = await instance
      .get(`/chat/${data.chat._id}?token=${token}`)
      .catch((err) => {
        if (!err.response) return alert("No Internet Connection");
        return console.log(err?.response?.data.message);
      });

    if (fetchedChat) {
      dispatch(getchats([fetchedChat.data, ...chats]));
    }

    return;
  };

  useEffect(() => {
    let token = window.localStorage.getItem("authUser");

    const checkAuth = async () => {
      if (!token) router.push("/auth?type=login");

      const user = await instance
        .get(`/authUser?token=${token}`)
        .catch((err) => router.push("/auth?type=login"));

      if (user.data) {
        dispatch(login(user.data.user));
      }

      return setloading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.on("message", (data) => {
      setnewMessage(data);
    });

    socket.on("CheckStatus", (data) => {
      dispatch(getUsersOnline(data));
    });

    socket.on("newMessage", (data) => {
      setnewChat(data);
    });
  }, []);

  let counter = 0;

  useEffect(() => {
    if (currentUser && counter < 1) {
      socket.emit("Online", { currentUser, socketId: socket.id });
      counter++;
    }
    return;
  }, [currentUser]);

  useEffect(() => {
    if (!newMessage) return;
    stackAnimation(newMessage.chatId);
  }, [newMessage]);

  useEffect(() => {
    if (!newChat) return;
    getChatInfo(newChat);
  }, [newChat]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="flex min-h-screen relative flex-col h-screen w-scrren bg-green-200">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Navbar />
      {showNotification && <NotificationBar info={notificationInfo} />}

      {router.asPath == "/newChat" && <AddNewChat />}

      <main className="flex flex-grow">
        <Sidebar socket={socket} />
        <AppBody socket={socket} />
      </main>
    </div>
  );
};

export default Home;

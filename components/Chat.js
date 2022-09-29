import { BigHead } from "@bigheads/core";
import moment from "moment";
import { useEffect } from "react";
import { BsCircleFill } from "react-icons/bs";
import { MdOutlineCircle } from "react-icons/md";
import { AiFillPushpin } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { changeChat, readMessages } from "../reduxKit/reducer";
import { useRouter } from "next/router";

function Chat({
  socket,
  id,
  last_update,
  name,
  recent_message,
  reciever,
  isOnline,
  unread,
  isPinned,
  avatar,
}) {
  const dispatch = useDispatch();
  let counter = 0;
  const router = useRouter();

  const getChat = () => {
    dispatch(changeChat({ id, last_update, name, reciever, avatar }));
    dispatch(readMessages({ chatId: id }));
    router.push("/", "/chat", { shallow: true });
  };

  useEffect(() => {
    if (counter > 0) return;
    socket.emit("Joined", id);

    return () => counter++;
  }, []);

  return (
    <div
      onClick={() => getChat()}
      className="flex items-center py-2 cursor-pointer hover:bg-gray-200 border-b border-slate-200"
    >
      <div className="h-12 w-14 relative flex items-center">
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

        {isOnline ? (
          <BsCircleFill className="text-green-500 text-[9px] absolute left-[65%] top-[85%]" />
        ) : (
          <MdOutlineCircle className="text-gray-500 text-[10px] absolute left-[65%] top-[85%]" />
        )}
      </div>

      <div className="flex-grow">
        <h3 className="text-sm text-slate-600">{name}</h3>
        <p className="text-xs text-gray-400">
          {recent_message?.message?.length > 20
            ? recent_message?.message.slice(0, 20) + "..."
            : recent_message?.message}
        </p>
      </div>

      <div className="flex flex-col items-center space-y-2">
        {isPinned && <AiFillPushpin className="text-sm text-gray-600" />}

        <p className="text-[8px] text-gray-400">
          {last_update && moment(last_update).fromNow()}
        </p>

        {unread > 0 && (
          <div className="h-5 w-5 flex items-center justify-center bg-red-400 text-white rounded-full">
            <p className="text-[10px]">{unread}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;

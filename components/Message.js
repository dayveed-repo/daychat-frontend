import moment from "moment";

const Message = ({ status, sent, timestamp, message }) => {
  return (
    <div className={`flex mb-8 ${sent || status ? "ml-auto w-max" : ""}`}>
      <div className={`flex flex-col ${sent || status ? "items-end" : ""}`}>
        <h4
          className={`text-xs p-3 w-max max-w-sm leading-5 ${
            sent || status ? "bg-green-500 text-white" : "bg-slate-200"
          } rounded-r-lg rounded-bl-lg`}
        >
          {message}
        </h4>
        <p className="text-[10px] text-gray-500">
          {status === "pending"
            ? "sending..."
            : status === "failed"
            ? "failed to send message"
            : moment(timestamp).fromNow()}
        </p>
      </div>
    </div>
  );
};

export default Message;

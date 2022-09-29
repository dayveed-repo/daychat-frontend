import { useRouter } from "next/router";
import { AiFillBell, AiOutlineSearch } from "react-icons/ai";

const Navbar = () => {
  const router = useRouter();

  return (
    <div className="py-3 px-4 flex items-center mb-5">
      <div className="flex items-center space-x-2">
        <img src="/chat-logo.png" alt="chat logo" className="h-10" />
        <h2 className="font-semibold text-green-900">DayChat</h2>
      </div>

      <div className="flex items-center flex-grow ml-5 mr-5 md:mr-10 justify-end space-x-4">
        <h3 onClick={() => router.push("/")} className="Navlink">
          Chats
        </h3>
        <h3 onClick={() => router.push("/settings")} className="Navlink">
          Setting
        </h3>
        <h3 className="Navlink hidden md:inline">Faqs</h3>
        <h3 className="Navlink hidden md:inline">Terms of Use</h3>
      </div>

      <div className="flex items-center space-x-5">
        <AiFillBell className="text-green-700" />
        <AiOutlineSearch className="text-green-700" />
      </div>
    </div>
  );
};

export default Navbar;

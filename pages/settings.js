import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EditInfo from "../components/EditInfo";
import LoadingScreen from "../components/LoadingScreen";
import Navbar from "../components/Navbar";
import { BigHead } from "@bigheads/core";
import { IoMdCreate } from "react-icons/io";
import AvatarForm from "../components/AvatarForm";
import NotificationBar from "../components/NotificationBar";
import instance from "../axiosConfig";

const Settings = () => {
  const [loading, setloading] = useState(true);
  const [userDetails, setuserDetails] = useState(null);
  const [changePassword, setchangePassword] = useState(false);
  const [avatarForm, setavatarForm] = useState(false);
  const [layerConfig, setlayerConfig] = useState({
    accessory: "none",
    body: "chest",
    circleColor: "blue",
    clothing: "naked",
    clothingColor: "red",
    eyebrows: "raised",
    eyes: "normal",
    facialHair: "none",
    hair: "none",
    hairColor: "black",
    hat: "none",
    hatColor: "black",
    lashes: "false",
    lipColor: "red",
    mouth: "grin",
    skinTone: "brown",
  });

  const [userForm, setuserForm] = useState({
    old_password: "",
    new_password: "",
    username: "",
  });

  const [showNotification, setshowNotification] = useState(false);
  const [notificationInfo, setnotificationInfo] = useState(null);
  const [updateErr, setupdateErr] = useState(null);
  const [updateloading, setupdateloading] = useState(false);

  const router = useRouter();
  const { currentUser } = useSelector((state) => state.app);

  const checkUpdate = () => {
    if (!avatarForm) return false;
    if (!userDetails) return true;

    if (!userDetails?.avatar) return true;

    const layerKeys = Object.keys(layerConfig);

    const counter = 0;

    layerKeys.forEach((key) => {
      if (userDetails?.avatar[key] === layerConfig[key]) {
        counter += 1;
      }
    });

    if (counter < layerKeys.length) return true;
    return false;
  };

  const saveAvatar = async () => {
    let token = window.localStorage.getItem("authUser");

    const saved = await instance.post(`/user/updateData?token=${token}`, {
      avatar: layerConfig,
    });

    if (saved?.data) {
      handleNotification("Your avatar has been saved");
      return setuserDetails({ ...userDetails, avatar: layerConfig });
    }
    return console.log(saved);
  };

  const handleInputChange = (e) => {
    setuserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };

  const updateUsername = async () => {
    let token = window.localStorage.getItem("authUser");

    const saved = await instance.post(`/user/updateData?token=${token}`, {
      username: userForm.username,
    });

    if (saved?.data) {
      handleNotification("Username has been changed successfully");
      return setuserDetails({ ...userDetails, username: userForm.username });
    }
    return console.log(saved);
  };

  const updatePassword = async () => {
    setupdateErr(null);

    if (!(userForm.old_password && userForm.new_password))
      return setupdateErr("New password and Old password are required");
    if (userForm.old_password === userForm.new_password)
      return setupdateErr("Both passwords are the Same");

    setupdateloading(true);
    let token = window.localStorage.getItem("authUser");

    await instance
      .post(`/updatePassword?token=${token}`, {
        old_password: userForm.old_password,
        new_password: userForm.new_password,
      })
      .then((_) => {
        setupdateloading(false);
        return handleNotification("Password has been updated successfully");
      })
      .catch((err) => {
        setupdateloading(false);
        return setupdateErr(err.response.data.message);
      });

    return setupdateloading(false);
  };

  const handleNotification = (info) => {
    setnotificationInfo(null);
    setshowNotification(true);

    setTimeout(() => {
      return setshowNotification(false);
    }, 3000);

    return setnotificationInfo(info);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("authUser");

    return router.push("/auth?type=login");
  };

  useEffect(() => {
    let token = window.localStorage.getItem("authUser");

    const fetchUserInfo = async () => {
      if (!token) {
        return router.push("/auth?type=login");
      }

      if (!currentUser) {
        return router.push("/");
      }

      await instance
        .post("/user", { email: currentUser.email })
        .then((res) => {
          setuserDetails(res.data.user);
          if (res.data.user?.avatar) {
            setlayerConfig(res.data.user.avatar);
          }
          setuserForm({
            ...userForm,
            username: res.data.user.username,
          });
        })
        .catch((err) => {
          if (!err.response) {
            return alert("No Internet connection");
          }
        });

      return setloading(false);
    };

    fetchUserInfo();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="relative w-screen h-screen bg-green-200 pb-5 flex flex-col">
      <Head>
        <title>Settings</title>
        <link rel="icon" href="/chat-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Navbar />

      {showNotification && <NotificationBar info={notificationInfo} />}

      <div className="w-full overflow-y-scroll pb-20 max-w-2xl space-y-5 px-7 mx-auto">
        <h3>{userDetails?.username} Settings</h3>

        <div className="h-40 w-40 relative flex items-center">
          <BigHead
            accessory={layerConfig?.accessory}
            body={layerConfig?.body}
            circleColor="blue"
            clothing={layerConfig?.clothing}
            clothingColor={layerConfig?.clothingColor}
            eyebrows={layerConfig?.eyebrows}
            eyes={layerConfig?.eyes}
            facialHair={layerConfig?.facialHair}
            graphic="react"
            hair={layerConfig?.hair}
            hairColor={layerConfig?.hairColor}
            hat={layerConfig?.hat}
            hatColor={layerConfig?.hatColor}
            lashes={layerConfig?.lashes}
            lipColor={layerConfig?.lipColor}
            mask="false"
            mouth={layerConfig?.mouth}
            skinTone={layerConfig?.skinTone}
          />

          <div
            onClick={() => setavatarForm(!avatarForm)}
            className="absolute left-[63%] bottom-[63%] cursor-pointer bg-green-400 rounded-full p-1"
          >
            <IoMdCreate className=" text-white" />
          </div>
        </div>

        <AvatarForm
          isOpen={avatarForm}
          layerConfig={layerConfig}
          setlayerConfig={setlayerConfig}
        />

        {checkUpdate() && (
          <button
            className="text-white bg-green-600 rounded-md px-4 py-1"
            onClick={() => saveAvatar()}
          >
            Save avatar
          </button>
        )}

        <div className="SettingSec">
          <h4 className="text-gray-600 text-medium">Personal Info</h4>

          <div className="SettingSecContent">
            <EditInfo field="email" value="dayveed@gmail.com" />
            <EditInfo
              field="username"
              value={userForm.username}
              handleInputChange={handleInputChange}
              editable
            />
            <button
              onClick={() => setchangePassword(!changePassword)}
              className="px-3 py-1 bg-green-200 text-green-600 rounded-md text-sm"
            >
              Change Password
            </button>

            {changePassword && (
              <div className="space-y-2 pt-5 flex flex-col w-3/5">
                <input
                  type={"text"}
                  value={userForm.old_password}
                  name="old_password"
                  className="outline-none placeholder:text-gray-600 border-green-400 border-2 rounded-md px-3 py-1"
                  placeholder="Enter Old Password"
                  onChange={(e) => handleInputChange(e)}
                />
                <input
                  type={"text"}
                  value={userForm.new_password}
                  name="new_password"
                  className="outline-none placeholder:text-gray-600 border-green-400 border-2 rounded-md px-3 py-1"
                  placeholder="Enter New Password"
                  onChange={(e) => handleInputChange(e)}
                />

                {updateloading ? (
                  <p className="animate-pulse text-xs text-gray-300">
                    Saving password
                  </p>
                ) : (
                  <button
                    onClick={() => updatePassword()}
                    className="text-white w-max bg-green-700 rounded-md px-4 py-1"
                  >
                    Save
                  </button>
                )}

                {updateErr && (
                  <p className="text-xs text-red-400">{updateErr}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {userForm.username !== userDetails?.username && (
          <button
            onClick={() => updateUsername()}
            className="text-sm text-white w-max bg-green-700 rounded-md px-4 py-1"
          >
            Update username
          </button>
        )}

        <div className="SettingSec">
          <button
            onClick={() => handleLogout()}
            className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

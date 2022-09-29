import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import instance from "../axiosConfig";

const Auth = () => {
  const router = useRouter();
  const [formInputs, setformInputs] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(null);

  const handleInputChange = (e) => {
    setformInputs({
      ...formInputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    seterror(null);
    setloading(true);

    await instance
      .post("/login", {
        email: formInputs.email,
        password: formInputs.password1,
      })
      .then((res) => {
        window.localStorage.setItem("authUser", res.data.token);
        router.push("/");
      })
      .catch((err) => {
        setloading(false);

        if (err.response.data) {
          seterror(err.response.data.message);
        } else {
          seterror("No internet Connection");
        }
      });

    return;
  };

  const handleRegister = async () => {
    seterror(null);
    setloading(true);

    if (formInputs.password1 !== formInputs.password2)
      return console.log("enter all inputs");

    await instance
      .post("/register", {
        username: formInputs.username,
        email: formInputs.email,
        password: formInputs.password1,
      })
      .then((res) => {
        window.localStorage.setItem("authUser", res.data.token);
        router.push("/");
      })
      .catch((err) => {
        setloading(false);

        if (err.response.data) {
          seterror(err.response.data.message);
        } else {
          seterror("No internet Connection");
        }
      });

    return;
  };

  const handleAuth = (e) => {
    e.preventDefault();
    router.query.type !== "login" ? handleRegister() : handleLogin();
  };

  const handleNavigate = () => {
    seterror(null);

    router.query.type !== "login"
      ? router.push("/auth?type=login")
      : router.push("/auth?type=register");

    return;
  };

  return (
    <div className="flex min-h-screen h-screen w-scrren">
      <Head>
        <title>{router.query.type === "login" ? "Login" : "Sign Up"}</title>
        <link rel="icon" href="/chat-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <form
        onSubmit={handleAuth}
        className="bg-green-500 flex-grow p-5 flex flex-col items-center"
      >
        <h3 className="text-xl text-green-100 mt-8">
          {router.query.type === "login" ? "Login" : "Sign Up"}
        </h3>

        <div className="mt-5 w-full max-w-lg">
          {router.query.type !== "login" && (
            <div className="InputContainer">
              <p>Username</p>
              <input
                type="text"
                name="username"
                onChange={handleInputChange}
                value={formInputs.username}
                className="AuthInput"
                placeholder="type your usersame"
              />
            </div>
          )}

          <div className="InputContainer">
            <p>Email</p>
            <input
              type="text"
              onChange={handleInputChange}
              name="email"
              value={formInputs.email}
              className="AuthInput"
              placeholder="type your email"
            />
          </div>

          <div className="InputContainer">
            <p>Password</p>
            <input
              type="password"
              onChange={handleInputChange}
              name="password1"
              value={formInputs.password1}
              className="AuthInput"
              placeholder="type your password"
            />
          </div>

          {router.query.type !== "login" && (
            <div className="InputContainer">
              <p>Confirm Password</p>
              <input
                type="password"
                onChange={handleInputChange}
                name="password2"
                value={formInputs.password2}
                className="AuthInput"
                placeholder="confirm your password"
              />
            </div>
          )}
        </div>

        {loading ? (
          <p className="animate-pulse text-gray-200">loading..</p>
        ) : (
          <button
            onClick={handleAuth}
            className="rounded-xl py-2 text-lg shadow-md w-full max-w-lg bg-white text-green-600"
          >
            {router.query.type === "login" ? "Login" : "Sign Up"}
          </button>
        )}

        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

        <div className="flex items-center space-x-1 text-sm w-full max-w-lg mt-8 justify-end">
          <h3 className="text-stone-600">
            {router.query.type === "login"
              ? "No Account yet ?"
              : "Already have an account ?"}
          </h3>
          <h2
            onClick={() => handleNavigate()}
            className="hover:underline text-green-200 cursor-pointer"
          >
            {router.query.type === "login" ? "Register" : "Login"}
          </h2>
        </div>
      </form>

      <div className="hidden md:flex w-2/4 flex-col items-center justify-center space-y-4">
        <div className="flex items-center space-x-2">
          <img src="/chat-logo.png" alt="chat logo" className="h-10" />
          <h2 className="font-semibold text-3xl text-green-900">DayChat</h2>
        </div>

        <img src="/daychatIllustration.svg" alt="illustration" />
      </div>
    </div>
  );
};

export default Auth;

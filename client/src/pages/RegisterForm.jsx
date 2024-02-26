import axios from "axios";
import { useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate} from "react-router-dom";

export default function RegisterForm() {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const initialState = {
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
    email: "",
  };

  const [input, setInput] = useState(initialState);

  const hdlChange = e => {
    setInput(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async e => {
    try {
      e.preventDefault();
      // validation
      if (input.password !== input.confirmPassword) {
        return alert("Please check confirm password");
      }
      const rs = await axios.post(`${apiUrl}/auth/register`, input);
      if (rs.status === 200) {
        toast.success("Register Successful");
        navigate("/Login")
        // Clear the form
        setInput(initialState);
      }
    } catch (err) {
      toast.error("มีอีเมลซ้ำ");
    }
  };

  return (
    <div className=" text-gray-900 flex justify-center mb-4">
      <div className="max-w-screen-xl  m-0 sm:m-10 bg-white shadow sm:rounded-2xl flex justify-center  flex-row-reverse flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 animate-fade-left animate-once animate-ease-linear">
          <h1 className="text-2xl xl:text-3xl font-extrabold  text-center">
            Sign up
          </h1>
          <div className="w-full flex-1 mt-8">
            <div className="flex flex-col items-center">
              <form onSubmit={hdlSubmit}>
                <div className=" grid grid-cols-1 gap-x-6 sm:grid-cols-6">
                  <div className="sm:col-span-3 pb-4">
                    <div className="mt-2 ">
                      <input
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white "
                        type="text"
                        placeholder="FirstName"
                        name="first_name"
                        id="first_name"
                        value={input.first_name}
                        onChange={hdlChange}
                        autoComplete="given-name"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3 pb-4">
                    <div className="mt-2">
                      <input
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white "
                        type="text"
                        placeholder="LastName"
                        name="last_name"
                        id="last_name"
                        value={input.last_name}
                       onChange={hdlChange}
                        autoComplete="family-name"
                      />
                    </div>
                  </div>
                </div>
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white "
                  type="email"
                  placeholder="Email"
                  required
                  name="email"
                  value={input.email}
                  onChange={hdlChange}
                  autoComplete="email"
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password"
                  placeholder="Password"
                  required
                  name="password"
                  value={input.password}
                  onChange={hdlChange}
                  autoComplete="current-password"
                />

                <input
                  type="password"
                  placeholder="ConfirmPassword"
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  required
                  name="confirmPassword"
                  value={input.confirmPassword}
                  onChange={hdlChange}
                  autoComplete="confirmPassword"
                />
                 <div className="divider divider-neutral "></div>
                <button className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                  <span className="ml-3">Sign up</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="flex-1  text-center hidden lg:flex">
          <div
            className=" xl:m-16 w-full bg-contain bg-center bg-no-repeat animate-jump animate-once animate-ease-in-out"
            style={{
              backgroundImage:
                "url('https://media.discordapp.net/attachments/822871594091151401/1204441126807801947/img.png?ex=65e73336&is=65d4be36&hm=c3c183dc6eeb16513569fd3b85f95b24667d36a37ac25863b3786423093dbba9&=&format=webp&quality=lossless&width=1052&height=701')",
            }}
          />
        </div>
      </div>
    </div>
  );
}

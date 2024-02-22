import React, { useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { Link ,useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { MdLogin } from "react-icons/md";
export default function LoginForm() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: "",
    password: ""
  });

  const hdlChange = e => {
    setInput(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const hdlSubmit = async e => {
    try {
      e.preventDefault();

      const rs = await axios.post("http://localhost:8000/auth/login", input);
      localStorage.setItem("token", rs.data.token);

      const rs1 = await axios.get("http://localhost:8000/auth/profile", {
        headers: { Authorization: `Bearer ${rs.data.token}` }
      });
      setUser(rs1.data);
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: `Welcome ${rs1.data.email}`,
        confirmButtonText: 'OK'
      });
      navigate('/');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'Invalid email or password. Please try again.',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data.message || "Something went wrong!",
          confirmButtonText: 'OK'
        });
      }
    }
  };
  return (
    <>
      <div className=" text-gray-900 flex justify-center mb-4">
        <div className="max-w-screen-xl  m-0 sm:m-10 bg-white shadow sm:rounded-2xl flex justify-center  flex-row-reverse flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 animate-fade-left animate-once animate-ease-linear">
              <h1 className="text-2xl xl:text-3xl font-extrabold  text-center">
               Sign in
              </h1>
              <div className="w-full flex-1 mt-8">
                <div className="flex flex-col items-center ">
              
                  <form  onSubmit={hdlSubmit} className="">
                    <input className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white "
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
                    <button className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                   <MdLogin  size={20} onClick={hdlSubmit}/>
                      <span className="ml-3">Sign in</span>
                    </button>
                  </form>
                  <div className="divider divider-neutral ">OR</div>
                  <button className="w-full  font-bold shadow-sm rounded-lg py-3 bg-zinc-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
                            <div className="bg-white p-2 rounded-full">
                                <svg className="w-4" viewBox="0 0 533.5 544.3">
                                    <path d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z" fill="#4285f4"></path>
                                    <path d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z" fill="#34a853"></path>
                                    <path d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z" fill="#fbbc04"></path>
                                    <path d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z" fill="#ea4335"></path>
                                </svg>
                            </div>
                            <span className="ml-4">
                                Sign in with Google
                            </span>
                        </button>
                        <button className="w-full  font-bold shadow-sm rounded-lg py-3 bg-zinc-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5">
                            <div className="bg-white  p-1 rounded-full">
                                <svg className="w-6" viewBox="0 0 32 32">
                                    <path fillRule="evenodd" d="M16 4C9.371 4 4 9.371 4 16c0 5.3 3.438 9.8 8.207 11.387.602.11.82-.258.82-.578 0-.286-.011-1.04-.015-2.04-3.34.723-4.043-1.609-4.043-1.609-.547-1.387-1.332-1.758-1.332-1.758-1.09-.742.082-.726.082-.726 1.203.086 1.836 1.234 1.836 1.234 1.07 1.836 2.808 1.305 3.492 1 .11-.777.422-1.305.762-1.605-2.664-.301-5.465-1.332-5.465-5.93 0-1.313.469-2.383 1.234-3.223-.121-.3-.535-1.523.117-3.175 0 0 1.008-.32 3.301 1.23A11.487 11.487 0 0116 9.805c1.02.004 2.047.136 3.004.402 2.293-1.55 3.297-1.23 3.297-1.23.656 1.652.246 2.875.12 3.175.77.84 1.231 1.91 1.231 3.223 0 4.61-2.804 5.621-5.476 5.922.43.367.812 1.101.812 2.219 0 1.605-.011 2.898-.011 3.293 0 .32.214.695.824.578C24.566 25.797 28 21.3 28 16c0-6.629-5.371-12-12-12z"></path>
                                </svg>
                            </div>
                            <span className="ml-4">
                             Sign in with GitHub
                            </span>
                        </button>

                </div>
              </div>
            </div>
       
          <div className="flex-1  text-center hidden lg:flex">
            <div className=" xl:m-16 w-full bg-contain bg-center bg-no-repeat animate-jump animate-once animate-ease-in-out"
              style={{ backgroundImage: "url('https://media.discordapp.net/attachments/822871594091151401/1204441126807801947/img.png?ex=65e73336&is=65d4be36&hm=c3c183dc6eeb16513569fd3b85f95b24667d36a37ac25863b3786423093dbba9&=&format=webp&quality=lossless&width=1052&height=701')", }}>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

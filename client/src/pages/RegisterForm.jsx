import axios from 'axios'
import {useState} from "react";

export default function RegisterForm() {
  const initialState = {
    first_name : '',
    last_name: '', 
    password : '',
    confirmPassword : '',
    email : ''
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
        return alert('Please check confirm password');
      }
      const rs = await axios.post('http://localhost:8000/auth/register', input);
      console.log(rs);
      if (rs.status === 200) {
        alert('Register Successful');
        // Clear the form
        setInput(initialState);
      }
    } catch(err) {
      console.log(err.message);
    }
  };


  return (
    <div className="flex justify-center items-center m-10">
    <div className="flex flex-col w-full max-w-2xl">
      <div className="card shadow-lg bg-white p-6">
        <h5 className="text-5xl font-bold">Register now!</h5>
        <form className="card-body" onSubmit={hdlSubmit}>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">
                First name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="FirstName"
                  name="first_name"
                  id="first_name"
                  autoComplete="given-name"
                  className="input input-bordered"
                  value={input.first_name}
                  onChange={ hdlChange }
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-gray-900">
                Last name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="LastName"
                  name="last_name"
                  id="last_name"
                  autoComplete="family-name"
                  className="input input-bordered"
                  value={input.last_name}
                  onChange={ hdlChange }
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="form-control">
                <input
                  id="email"
                  placeholder="@Email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="input input-bordered"
                  value={input.email}
                  onChange={ hdlChange }
                />
              </div>
            </div>
            </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered"
              required
              name="password"
              value={input.password}
              onChange={hdlChange}
              autoComplete="new-password"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">ConfirmPassword</span>
            </label>
            <input
              type="password"
              placeholder="ConfirmPassword"
              className="input input-bordered"
              required
              name="confirmPassword"
              value={input.confirmPassword}
              onChange={hdlChange}
              autoComplete="confirmPassword"
            />
          </div>
          <div className="form-control mt-6">
            <button className="btn btn-primary">Register</button>
          </div>
        </form>
       
    
          {/* Buttons for social media sign-up */}
     
      </div>
    </div>
  </div>
  );
}

import { useState } from "react";
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {

  const [signupError, setSignupError] = useState("");
  const navigate = useNavigate();

  const schema = yup.object({
    username: yup.string().required("username is required"),
    password: yup.string().min(4).max(20).required("Password is required"),
    cpassword: yup.string().oneOf([yup.ref("password"), null], "Password and Confirm Password should be same"),
    accountType: yup.string().required("Account Type is required"),
    // money: yup.string().required("Money is required")
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    console.log({
      id: data.username,
      password: data.password,
      money: data.money,
      accountType: data.accountType,
    })
    const SIGNUP_API = "http://localhost:3000/createUser";
    const res = await axios.post(SIGNUP_API, {
      id: data.username,
      password: data.password,
      // money: data.money,
      accountType: data.accountType,
    });
    if(res.data?.message === "User created") {
      alert("Signup Success");
      navigate('/login')
    }
    else {
      setSignupError("Error in Creating User")
    }
  }

  return (
    <div className='w-full py-10' >
      <div className='mx-5 xl:mx-auto'>
        <div className="block p-8 rounded-lg shadow-lg bg-white max-w-lg mx-auto">
          <div className="text-red-800 m-auto text-center font-bold">{signupError}</div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group mb-6">
              <label htmlFor="username" className="form-label inline-block mb-2 text-lg text-gray-800">Username</label>
              <input type="text" className="form-control block w-full px-3 py-1.5 text-base text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="username" id="username" placeholder="username" {...register("username")} />
              <p className="text-red-500 text-sm">{errors.username?.message}</p>
            </div>
            <div className="form-group mb-6">
              <label htmlFor="password" className="form-label inline-block mb-2 text-lg text-gray-800">Password</label>
              <input type="password" className="form-control block w-full px-3 py-1.5 text-base text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="password" id="password" placeholder="Password" {...register("password")} />
              <p className="text-red-500 text-sm">{errors.password?.message}</p>
            </div>
            <div className="form-group mb-6">
              <label htmlFor="cpassword" className="form-label inline-block mb-2 text-lg text-gray-800">Confirm Password</label>
              <input type="password" className="form-control block w-full px-3 py-1.5 text-base text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="cpassword" id="cpassword" placeholder="Confirm Password" {...register("cpassword")} />
              <p className="text-red-500 text-sm">{errors.cpassword?.message}</p>
            </div>
            <div className="form-group mb-6">
              <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
              <select name="accountType" id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register("accountType")}>
                <option value="Employer">Employer</option>
                <option value="Employee">Employee</option>
              </select>
              <p className="text-red-500 text-sm">{errors.accountType?.message}</p>
            </div>
            {/* <div className="form-group mb-6">
              <label htmlFor="money" className="form-label inline-block mb-2 text-lg text-gray-800">Money</label>
              <input type="text" className="form-control block w-full px-3 py-1.5 text-base text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="money" id="money" placeholder="Money" {...register("money")} />
              <p className="text-red-500 text-sm">{errors.money?.message}</p>
            </div> */}
            <button className='px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white hover:text-white' type="submit">Sign Up</button>
          </form>
        </div>
      </div>
      <div className="text-center mt-8">
        <a href="/login" className="text-blue-600 font-semibold">Already have an account? Login</a>
      </div>
    </div >
  )
}

export default Signup

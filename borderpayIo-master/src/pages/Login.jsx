import { useForm, useFormState } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

const Login = () => {
  const schema = yup.object({
    username: yup.string().required("UserName is required"),
    password: yup.string().required("Password is required"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    console.log(data);
  }

  return (
    <div className='w-full py-24'>
      <div className='mx-5 xl:mx-auto'>
        <div className="block p-8 rounded-lg shadow-lg bg-white max-w-lg mx-auto">
          <div className="text-red-800 m-auto text-center font-bold"></div>
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
            <button type="submit" className='px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white hover:text-white'>LogIn</button>
          </form>
        </div>
      </div>
      <div className="text-center mt-8">
        {/* <Link to="/signup" className="text-blue-600 font-semibold">New to CF Stress? Create an account</Link> */}
      </div>
    </div>
  )
}

export default Login
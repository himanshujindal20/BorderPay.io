import { useForm, useFormState } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Contract = () => {
  const navigate = useNavigate();
  const schema = yup.object({
    employeeUsername: yup.string().required("Employee Username is required"),
    salary: yup.string().required("Salary is required"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    const CREATE_CONTRACT_API = "http://localhost:3000/createContract";
    const res = await axios.post(CREATE_CONTRACT_API, {
      employer_id: "user1",
      employee_id: data.employeeUsername,
      salary: data.salary,
      is_running: "1"
    });
    if(res.data?.message=="Contract created") {
      alert("Contract Created Successfully");
      navigate('/employee-list')
    }
  }

  return (
    <div className='w-full py-24'>
      <div className='mx-5 xl:mx-auto'>
        <div className="block p-8 rounded-lg shadow-lg bg-white max-w-lg mx-auto">
          <div className="text-red-800 m-auto text-center font-bold"></div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group mb-6">
              <label htmlFor="employeeUsername" className="form-label inline-block mb-2 text-lg text-gray-800">Employee Username</label>
              <input type="text" className="form-control block w-full px-3 py-1.5 text-base text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="employeeUsername" id="employeeUsername" placeholder="Employee Username" {...register("employeeUsername")} />
              <p className="text-red-500 text-sm">{errors.employeeUsername?.message}</p>
            </div>
            <div className="form-group mb-6">
              <label htmlFor="salary" className="form-label inline-block mb-2 text-lg text-gray-800">Salary Per Month</label>
              <input type="text" className="form-control block w-full px-3 py-1.5 text-base text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="salary" id="salary" placeholder="Salary Per Month" {...register("salary")} />
              <p className="text-red-500 text-sm">{errors.salary?.message}</p>
            </div>
            <button type="submit" className='px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white hover:text-white'>Create</button>
          </form>
        </div>
      </div>
      <div className="text-center mt-8">
        {/* <a href="/signup" className="text-blue-600 font-semibold">New to CF Stress? Create an account</a> */}
      </div>
    </div>
  )
}

export default Contract
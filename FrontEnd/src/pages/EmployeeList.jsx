import { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";
import axios from "axios";
import { Navigate } from "react-router-dom"; 

const EmployeeList = () => {
  const {user} = useContext(UserContext);
  const [employeList, setEmployeeList] = useState([]);
  const [balance, setBalance] = useState(0);
  const handlePay = async (id) => {
    const res = await axios.post("http://localhost:3000/transferMoney",
      {
        "employer_id": user, 
        "employee_id": id
      }
    );
    alert("money transferred successfully")
    const res2 = await axios.post("http://localhost:3000/readBank", {
          id: user
      });
        setBalance(res2.data.Money);
  };
  useEffect(() => { 
    (
      async () => {
        const res = await axios.get("http://localhost:3000/getAllContracts");
        setEmployeeList(res.data);
        const res2 = await axios.post("http://localhost:3000/readBank", {
          id: user
        });
        setBalance(res2.data.Money);
      }
    )();
  }, []);
  return (
    <div class="relative overflow-x-auto">
      {!user && <Navigate to="/login" />}
      <h1 className="mt-4 ml-4">Account Balance: {balance}</h1>
      <table class="w-[1200px] m-auto mt-8 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">
              Employee UserName
            </th>
            <th scope="col" class="px-6 py-3">
              Salary Per Month
            </th>
            <th scope="col" class="px-6 py-3">
              Pay
            </th>
          </tr>
        </thead>
        <tbody>
          {
            employeList.map((employee) => (
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {employee.Employee_ID}
                </th>
                <td class="px-6 py-4">{employee.Salary}</td>
                <td class="px-6 py-4 cursor-pointer" onClick={() => handlePay(employee.Employee_ID)}><button>Pay</button></td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;

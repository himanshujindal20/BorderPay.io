const EmployeeList = () => {
  return (
    <div class="relative overflow-x-auto">
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
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              himanshu@gmail.com
            </th>
            <td class="px-6 py-4">
              $202
            </td>
            <td class="px-6 py-4">
              Pay
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  )
}

export default EmployeeList
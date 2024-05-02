import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import EmployeeList from "./pages/EmployeeList.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Contract from "./pages/Contract.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/employee-list",
    element: <EmployeeList />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "create-contract",
    element: <Contract />,
  },
]);

import Navbar from "./components/Navbar";
import { createContext, useState } from "react";

export const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div>
        <Navbar />
        <RouterProvider router={router} />
      </div>
    </UserContext.Provider>
  );
}

export default App;

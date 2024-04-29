import Contract from "./pages/Contract"
import EmployeeList from "./pages/EmployeeList"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Home from "./pages/Home"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar"

function App() {
  return (
    <div>
        <Router>
          <Navbar />
          <Switch>
            <Route path="/" exact><Home /></Route>
            <Route path="/create-contract" exact> <Contract /></Route>
            <Route path="/signup" exact> <Signup /></Route>
            <Route path="/login" exact> <Login /></Route>
            <Route path='/employee-list' exact><EmployeeList /></Route>
          </Switch>
        </Router>
      </div>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UsersPage from "./Admin/Dashboard/List";
import CreateUserForm from "./Admin/Dashboard/CreateUserForm";
import EditUserPage from "./Admin/Dashboard/EditUserForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/create" element={<CreateUserForm />} />
        <Route path="/users/:id/edit" element={<EditUserPage />} />
        <Route path="/" element={<h1>Welcome to the App</h1>} />
      </Routes>
    </Router>
  );
}

export default App;

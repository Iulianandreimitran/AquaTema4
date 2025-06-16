import { createBrowserRouter } from "react-router-dom";
import UsersPage from "./Admin/Dashboard/List";
import CreateUserForm from "./Admin/Dashboard/CreateUserForm";
import EditUserPage from "./Admin/Dashboard/EditUserForm";
import RegisterPage from "./Auth/RegisterPage";
import WelcomePage from "./components/WelcomePage";
import LoginPage from "./Auth/LoginPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/users",
    element: <UsersPage />,
  },
    {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/users/create",
    element: <CreateUserForm />,
  },
  {
    path: "/users/:id/edit",
    element: <EditUserPage />,
  },
]);

export default router;

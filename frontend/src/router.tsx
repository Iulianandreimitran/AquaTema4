import { createBrowserRouter } from "react-router-dom";
import UsersPage from "./Admin/Dashboard/List";
import CreateUserForm from "./Admin/Dashboard/CreateUserForm";
import EditUserPage from "./Admin/Dashboard/EditUserForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>Welcome to the App</h1>,
  },
  {
    path: "/users",
    element: <UsersPage />,
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

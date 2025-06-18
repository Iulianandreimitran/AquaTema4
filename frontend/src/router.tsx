import { createBrowserRouter } from "react-router-dom";
import UsersPage from "./Admin/Dashboard/List";
import CreateUserForm from "./Admin/Dashboard/CreateUserForm";
import EditUserPage from "./Admin/Dashboard/EditUserForm";
import RegisterPage from "./Auth/RegisterPage";
import WelcomePage from "./components/WelcomePage";
import LoginPage from "./Auth/LoginPage";
import HotelManagerPage from "./Manager/HotelPage";
import NotAuthorizedPage from "./Traveler/NotAuthorizedPage";
import ConfigureManagersPage from "./Admin/Dashboard/ConfigureManagersPage";
import AssignHotelsToGroupPage from "./HotelGroup/AssignHotelsToGroupPage";
import CreateHotelGroupPage from "./HotelGroup/CreateHotelGroupPage";
import EditHotelGroupPage from "./HotelGroup/EditHotelGroupPage";

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
  { 
    path: "/hotel-page", 
    element: <HotelManagerPage /> 
  },
  {
  path: "/not-authorized",
  element: <NotAuthorizedPage />
  },
  {
  path: "/users/configure-managers",
  element: <ConfigureManagersPage />
  },
  {
    path: "/assign-hotels-to-group",
    element: <AssignHotelsToGroupPage />,
  },
  {
    path: "/create-hotel-group",
    element: <CreateHotelGroupPage />,
  },
    {
    path: "/edit-hotel-group/:id",
    element: <EditHotelGroupPage />,
  },

]);

export default router;

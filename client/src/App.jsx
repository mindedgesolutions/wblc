import { RouterProvider, createBrowserRouter } from "react-router-dom";
import * as Wb from "./pages";
import { store } from "./store";

import { action as loginAction } from "./pages/auth/Login";

import { loader as layoutLoader } from "./pages/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <Wb.Login />,
    errorElement: <Wb.Error />,
    action: loginAction(store),
  },
  { path: "/forgot-password", element: <Wb.ForgotPassword /> },
  { path: "/change-password", element: <Wb.ChangePassword /> },
  { path: "/profile", element: <Wb.Profile /> },
  {
    path: "/admin",
    element: <Wb.Layout />,
    loader: layoutLoader(store),
    children: [
      { path: "dashboard", element: <Wb.AdminDashboard /> },
      { path: "users", element: <Wb.UserList /> },
      { path: "modules", element: <Wb.ModuleList />, errorElement: <Error /> },
      { path: "roles", element: <Wb.RoleList /> },
      { path: "permissions", element: <Wb.PermissionList /> },
      { path: "role-permissions", element: <Wb.PermissionRole /> },
      { path: "user-permissions", element: <Wb.PermissionUser /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

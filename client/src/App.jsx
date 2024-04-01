import { RouterProvider, createBrowserRouter } from "react-router-dom";
import * as Wb from "./pages";
import { store } from "./store";

const router = createBrowserRouter([
  { path: "/", index: true, element: <Wb.Login />, errorElement: <Wb.Error /> },
  { path: "/change-password", element: <Wb.ChangePassword /> },
  { path: "/profile", element: <Wb.Profile /> },
  {
    path: "/admin",
    element: <Wb.Layout />,
    children: [
      { path: "users", element: <Wb.UserList /> },
      { path: "modules", element: <Wb.ModuleList /> },
      { path: "roles", element: <Wb.RoleList /> },
      { path: "role-permissions", element: <Wb.PermissionRole /> },
      { path: "user-permissions", element: <Wb.PermissionUser /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

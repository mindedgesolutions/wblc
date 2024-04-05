import React from "react";
import { Outlet, redirect, useLoaderData, useNavigate } from "react-router-dom";

import "../assets/dist/css/tabler.min.css";
import "../assets/dist/css/demo.min.css";

import "../assets/dist/js/tabler.min.js";
import "../assets/dist/js/demo.min.js";

import "react-datepicker/dist/react-datepicker.css";
import { Footer, SideBar, TopNav } from "../components/index.js";
import customFetch from "../utils/customFetch.js";
import { toast } from "react-toastify";
import { splitErrors } from "../utils/showErrors.jsx";
import { setLoggedinUser } from "../features/users/userSlice.js";

export const loader = (store) => async () => {
  try {
    const response = await customFetch.get(`/users/user-info`);
    store.dispatch(
      setLoggedinUser({
        user: response.data.user.rows[0],
        roles: response.data.roles.rows,
        permissions: response.data.permissions.rows,
      })
    );
    return null;
  } catch (error) {
    splitErrors(error?.response?.data?.msg);
    if (error?.response?.status === 401) {
      return redirect("/");
    }
    return error;
  }
};

const Layout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await customFetch.get(`/auth/admin/logout`);
    toast.success(`You've logged out successfully`);
    navigate("/");
  };

  return (
    <>
      <TopNav logout={logout} />
      <SideBar />
      <div className="page-wrapper">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;

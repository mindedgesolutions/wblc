import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

import "../assets/dist/css/tabler.min.css";
import "../assets/dist/css/demo.min.css";

import "../assets/dist/js/tabler.min.js";
import "../assets/dist/js/demo.min.js";

import "react-datepicker/dist/react-datepicker.css";
import { Footer, SideBar, TopNav } from "../components/index.js";
import customFetch from "../utils/customFetch.js";
import { toast } from "react-toastify";

const Layout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    console.log(`logout`);
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

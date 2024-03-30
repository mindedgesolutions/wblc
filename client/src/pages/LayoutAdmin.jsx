import React from "react";
import { Outlet } from "react-router-dom";

import "../assets/dist/css/tabler.min.css";
import "../assets/dist/css/demo.min.css";

import "../assets/dist/js/tabler.min.js";
import "../assets/dist/js/demo.min.js";

import "react-datepicker/dist/react-datepicker.css";
import { Footer, SideBar, TopNav } from "../components";

const LayoutAdmin = () => {
  return (
    <>
      <TopNav />
      <SideBar />
      <Outlet />
      <Footer />
    </>
  );
};

export default LayoutAdmin;

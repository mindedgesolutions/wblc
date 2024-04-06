import React from "react";
import { useNavigate } from "react-router-dom";
import { splitErrors } from "../utils/showErrors";

const Error = ({ text, status }) => {
  const navigate = useNavigate();

  return (
    <>
      {splitErrors(text)}
      {status === 401 && navigate("/")}
    </>
  );
};

export default Error;

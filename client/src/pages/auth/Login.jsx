import React, { useEffect, useState } from "react";
import Logo from "../../assets/images/logo-karmasathi-parijayee-shramik.png";
import { Form, Link, redirect } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineRefresh } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setCaptcha } from "../../features/auth/authSlice";
import { splitErrors } from "../../utils/showErrors";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import { SubmitBtn } from "../../components";

// Action starts ------
export const action = (store) => async ({ request }) => {
  const { captcha } = store.getState().auth;
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  data = { ...data, captcha: captcha };

  try {
    await customFetch.post(`/auth/admin/login`, data);
    toast.success(`You're logged in`);
    return redirect(`/admin/dashboard`);
  } catch (error) {
    store.dispatch(setCaptcha());
    splitErrors(error?.response?.data?.msg);
    return error;
  }
};

// Main component starts ------
const Login = () => {
  document.title = `Admin Login | ${import.meta.env.VITE_ADMIN_TITLE}`;
  const dispatch = useDispatch();
  const { captcha } = useSelector((store) => store.auth);

  const [inputType, setInputType] = useState("password");
  const [form, setForm] = useState({
    username: "",
    password: "",
    inputCaptcha: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTypeChange = () => {
    setInputType(inputType === "password" ? "text" : "password");
  };

  useEffect(() => {
    dispatch(setCaptcha());
  }, []);

  const captchaImage = !captcha
    ? `https://dummyimage.com/120x50/000/fff&text=${`Loading ...`}`
    : `https://dummyimage.com/120x50/000/fff&text=${captcha}`;

  return (
    <div className="page page-center">
      <div className="container container-tight py-4">
        <div className="text-center mb-4">
          <Link to="/" className="navbar-brand navbar-brand-autodark">
            <img
              src={Logo}
              style={{ width: "300px", height: "60px" }}
              alt={import.meta.env.VITE_ADMIN_TITLE}
              className="navbar-brand-image"
            />
          </Link>
        </div>
        <div className="card card-md">
          <div className="card-body">
            <h2 className="h2 text-center mb-4">Login to your account</h2>
            <Form method="post" autoComplete="off">
              <div className="mb-3">
                <label className="form-label" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="form-control"
                  placeholder="Your username"
                  autoFocus={true}
                  onPaste={(e) => {
                    e.preventDefault();
                  }}
                  onCopy={(e) => {
                    e.preventDefault();
                  }}
                  onCut={(e) => {
                    e.preventDefault();
                  }}
                  value={form.username}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="password">
                  Password
                  <span className="form-label-description">
                    <Link to="/forgot-password">I forgot password</Link>
                  </span>
                </label>
                <div className="input-group input-group-flat">
                  <input
                    type={inputType}
                    name="password"
                    id="password"
                    className="form-control"
                    placeholder="Your password"
                    onPaste={(e) => {
                      e.preventDefault();
                    }}
                    onCopy={(e) => {
                      e.preventDefault();
                    }}
                    onCut={(e) => {
                      e.preventDefault();
                    }}
                    value={form.password}
                    onChange={handleChange}
                  />
                  <span className="input-group-text">
                    <IoEyeOutline
                      size={18}
                      className="link-secondary cursor-pointer"
                      title="Show password"
                      onClick={handleTypeChange}
                    />
                  </span>
                </div>
              </div>
              <div className="row row-cards mb-3">
                <div className="col-sm-5 col-md-5">
                  <div className="bg-black w-full h-full p-1 rounded text-center fw-bold">
                    <img src={captchaImage} alt={captcha} />
                  </div>
                </div>
                <div className="col-sm-1 col-md-1 pt-5 align-center">
                  <MdOutlineRefresh
                    size={24}
                    className="cursor-pointer"
                    onClick={() => dispatch(setCaptcha())}
                  />
                </div>
                <div className="col-sm-6 col-md-6">
                  <label className="form-label">Enter captcha</label>
                  <input
                    type="text"
                    name="inputCaptcha"
                    className="form-control"
                    placeholder="Enter captcha"
                    onPaste={(e) => {
                      e.preventDefault();
                    }}
                    onCopy={(e) => {
                      e.preventDefault();
                    }}
                    onCut={(e) => {
                      e.preventDefault();
                    }}
                    value={form.inputCaptcha}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-footer">
                <SubmitBtn className="btn btn-success w-100" text="Sign in" />
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

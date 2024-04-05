import { createSlice } from "@reduxjs/toolkit";

const generateCaptcha = () => {
  const captchaChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let captcha = "";
  for (let i = 0; i < 6; i++) {
    captcha += captchaChars.charAt(
      Math.floor(Math.random() * captchaChars.length)
    );
  }
  return captcha;
};

const initialState = {
  captcha: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setCaptcha: (state) => {
      state.captcha = generateCaptcha();
    },
  },
});

export const { setCaptcha } = authSlice.actions;
export default authSlice.reducer;

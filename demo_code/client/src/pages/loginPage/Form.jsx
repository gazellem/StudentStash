import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
const emailValidator = (email) => {
  return email.endsWith("bilkent.edu.tr");
};

const registerSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup
      .string()
      .email("Invalid email")
      .test("email-domain", "Only Bilkent emails are allowed.", emailValidator)
      .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const loginSchema = yup.object().shape({
  email: yup
      .string()
      .email("Invalid email")
      .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const initialValuesRegister = {
  username: "",
  email: "",
  password: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";



  const emailValidator = (email) => {
    return email.endsWith("bilkent.edu.tr");
  };
  // Register function
  const register = async (values, onSubmitProps) => {
    const savedUserResponse = await fetch("http://localhost:3500/users/register/", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      setPageType("login");
    }
  };

  // Login function
  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch('http://localhost:3500/auth/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(setLogin({
        user: loggedIn.user,
        token: loggedIn.token,
      }));
      navigate("/home");
    }
  };

  // Handle form submission
  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };


  return (
      <Formik
          onSubmit={handleFormSubmit}
          initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
          validationSchema={isLogin ? loginSchema : registerSchema}
      >
        {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              {isRegister && (
                  <TextField
                      label="Username"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.username}
                      name="username"
                      error={Boolean(touched.username) && Boolean(errors.username)}
                      helperText={touched.username && errors.username}
                      fullWidth
                      sx={{ mb: 2 }}
                  />
              )}

              <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  fullWidth
                  sx={{ mb: 2 }}
              />

              <TextField
                  label="Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  fullWidth
                  sx={{ mb: 2 }}
              />

              <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mb: 2 }}
              >
                {isLogin ? "Login" : "Register"}
              </Button>

              <Typography
                  onClick={() => {
                    setPageType(isLogin ? "register" : "login");
                  }}
                  sx={{
                    textDecoration: "underline",
                    cursor: "pointer",
                    textAlign: "center",
                    color: palette.primary.main,
                    "&:hover": { color: palette.primary.light },
                  }}
              >
                {isLogin ? "Don't have an account? Sign Up here." : "Already have an account? Login here."}
              </Typography>
            </form>
        )}
      </Formik>
);
};

export default Form;
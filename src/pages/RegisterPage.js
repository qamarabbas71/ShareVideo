import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Container, Button, Row, Col, Card } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import API_ENDPOINTS from "../config";
import "react-toastify/dist/ReactToastify.css";

const RegisterPage = () => {

  const navigate = useNavigate();

  
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(4, "Username must be at least 4 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleRegister = async (values, { setSubmitting, resetForm }) => {
    try {
      
      console.log(values);
      const response = await axios.post(
        API_ENDPOINTS.register,
        // "http://localhost:5000/api/users/register",
        {
          username: values.username,
          email: values.email,
          password: values.password,
        }
      );

      if (response.data) {
        
        <div class="alert alert-primary" role="alert">
          A simple primary alert—check it out!
        </div>;
        console.log("User created Successfully..");
        navigate('/login');
        resetForm();

        localStorage.setItem("userToken", response.data.token);
      }
    } catch (error) {
      console.log("Error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Row>
        <Col md={12}>
          <Card className="p-4 shadow-lg">
            <Card.Body>
              <h2 className="text-center mb-4">Create Your Account</h2>
              <Formik
                initialValues={{
                  username: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleRegister}
              >
                {({ isSubmitting }) => (
                  <Form>
                    {/* Username Field */}
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">
                        Username
                      </label>
                      <Field
                        type="text"
                        id="username"
                        name="username"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="text-danger mt-1"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <Field
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-danger mt-1"
                      />
                    </div>

                    {/* Password Field */}
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <Field
                        type="password"
                        id="password"
                        name="password"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-danger mt-1"
                      />
                    </div>

                    {/* Confirm Password Field */}
                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirm Password
                      </label>
                      <Field
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-danger mt-1"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="d-grid">
                      <Button
                        type="submit"
                        variant="success"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Registering..." : "Register"}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
              <div className="text-center mt-3">
                <p>
                  Already have an account? <Link to="/login">Go to Login</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;

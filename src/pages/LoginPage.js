import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      await login(values.email, values.password);
      navigate('/');
    } catch (error) {
      setErrors({ email: 'Invalid email or password' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row>
        <Col md={12}>
          <Card className="p-4 shadow-lg">
            <Card.Body>
              <h2 className="text-center mb-4">Welcome Back!</h2>
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleLogin}
              >
                {({ isSubmitting }) => (
                  <Form>
                    {/* Email Field */}
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <Field type="email" id="email" name="email" className="form-control" />
                      <ErrorMessage name="email" component="div" className="text-danger mt-1" />
                    </div>

                    {/* Password Field */}
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <Field type="password" id="password" name="password" className="form-control" />
                      <ErrorMessage name="password" component="div" className="text-danger mt-1" />
                    </div>

                    {/* Submit Button */}
                    <div className="d-grid">
                      <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Login'}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
              <div className="text-center mt-3">
                <p>
                  Not registered? <Link to="/register">Create your account</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;

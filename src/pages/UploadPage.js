import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import axios from 'axios';

const UploadPage = () => {
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoDurationError, setVideoDurationError] = useState('');
  const [uploadError, setUploadError] = useState('');

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required')
      .min(3, 'Title must be at least 3 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters'),
    video: Yup.mixed()
      .required('Video file is required')
      .test('fileSize', 'File size must be 5MB or less', (value) =>
        value ? value.size <= 5 * 1024 * 1024 : false
      ),
  });

  const handleVideoUpload = (file, setFieldValue) => {
    if (file) {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        if (video.duration > 60) {
          setVideoDurationError('Video must be 60 seconds or less');
          setFieldValue('video', null);
          setVideoPreview(null);
        } else {
          setVideoDurationError('');
          setFieldValue('video', file);
          setVideoPreview(video.src);
        }
      };
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append('title', values.title);  // Changed field name to 'title'
    formData.append('description', values.description);
    formData.append('video', values.video);  // Changed field name to 'video'

    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const response = await axios.post('http://localhost:5000/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, 
        },
      });

      alert('Video uploaded successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading video:', error);
      setUploadError('Error uploading video. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-lg">
        <h2 className="text-center mb-4">Upload Your Video</h2>
        <Formik
          initialValues={{ title: '', description: '', video: null }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form>
              <Row>
                {/* Video Preview Section */}
                <Col md={6} className="d-flex align-items-center justify-content-center">
                  {videoPreview ? (
                    <video
                      src={videoPreview}
                      controls
                      style={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: '100%',
                        height: '250px',
                        border: '2px dashed #ccc',
                        borderRadius: '10px',
                        background: '#f8f9fa',
                        color: '#aaa',
                      }}
                    >
                      <p className="text-center">Video preview will appear here</p>
                    </div>
                  )}
                </Col>

                {/* Video Details Section */}
                <Col md={6}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Video Title
                    </label>
                    <Field id="title" name="title" className="form-control" />
                    <ErrorMessage name="title" component="div" className="text-danger mt-1" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <Field
                      id="description"
                      name="description"
                      as="textarea"
                      className="form-control"
                      rows={3}
                    />
                    <ErrorMessage name="description" component="div" className="text-danger mt-1" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="video" className="form-label">
                      Video File
                    </label>
                    <input
                      id="video"
                      name="video"
                      type="file"
                      accept="video/mp4,video/x-m4v,video/*"
                      className="form-control"
                      onChange={(event) =>
                        handleVideoUpload(event.target.files[0], setFieldValue)
                      }
                    />
                    {videoDurationError && <div className="text-danger mt-1">{videoDurationError}</div>}
                    <ErrorMessage name="video" component="div" className="text-danger mt-1" />
                  </div>

                  {uploadError && <div className="text-danger mt-2">{uploadError}</div>}

                  <div className="d-grid">
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                      {isSubmitting ? 'Uploading...' : 'Upload Video'}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Card>
    </Container>
  );
};

export default UploadPage;

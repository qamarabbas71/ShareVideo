import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/videos/search`, {
        params: { query },
      });
      setVideos(response.data);
    } catch (error) {
      console.error("Error searching videos:", error);
      setError("Failed to fetch search results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h3 className="text-center mb-4">Search Videos</h3>
      <Form onSubmit={handleSearch} className="mb-4">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Form.Control
              type="text"
              placeholder="Search for videos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Col>
          <Col xs="auto">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </Col>
        </Row>
      </Form>

      {error && <p className="text-danger text-center">{error}</p>}

      {videos.length > 0 && (
        <Row className="mt-4">
          {videos.map((video) => (
            <Col key={video._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card>
                <video
                  src={`http://localhost:5000${video.videoUrl}`}
                  controls
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{video.title}</Card.Title>
                  <Card.Text>{video.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {videos.length === 0 && !loading && query && (
        <p className="text-center text-muted">No videos found for "{query}".</p>
      )}
    </Container>
  );
};

export default Search;

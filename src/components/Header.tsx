
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header: React.FC = () => {
  const router = useRouter();

  return (
    <Container fluid className="my-4">
      <Row className="text-center mb-3">
        <Col>
          <h1>Welcome to QuizApp</h1>
        </Col>
      </Row>
      <Row className="align-items-center">
        <Col>
          <h1>Quizzes</h1>
        </Col>
        <Col className="text-end">
          <Button
            variant="primary"
            onClick={() => router.push("/create-quiz")}
          >
            Add New Quiz
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Header;

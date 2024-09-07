

import { useQuizContext } from "@/store/QuizContext";
import { useRouter } from "next/router";
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const QuizList = () => {
  const { quizzes } = useQuizContext();
  const router = useRouter();

  return (
    <Container className="my-5">
      <Row xs={1} md={2} lg={3} className="g-4">
        {quizzes.map((quiz) => (
          <Col key={quiz.id}>
            <Card>
              <Card.Body>
                <Card.Title>{quiz.title}</Card.Title>
                <Card.Text>
                  {quiz.description || "No description available"}
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => router.push(`/edit-quiz/${quiz.id}`)}
                >
                  Edit
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default QuizList;

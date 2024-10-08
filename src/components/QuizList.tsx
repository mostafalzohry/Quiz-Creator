import { useQuizContext } from "../store/QuizContext";
import { useRouter } from "next/router";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-GB", options);
};

const QuizList = () => {
  const { quizzes, deleteQuiz } = useQuizContext();
  const router = useRouter();

  return (
    <Container className="my-5">
      <Row xs={1} md={2} lg={3} className="g-4">
        {quizzes.map((quiz) => (
          <Col key={quiz.id}>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title>{quiz.title}</Card.Title>
                  <span className="text-muted">
                    Created on: {formatDate(quiz.created)}
                  </span>
                </div>
                <Card.Text className="mt-3">
                  {quiz.description || "No description available"}
                </Card.Text>
                <div className="d-flex gap-2 mt-3">
                  <Button
                    variant="primary"
                    onClick={() => router.push(`/edit-quiz/${quiz.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => router.push(`/quiz/${quiz.id}`)}
                  >
                    View Questions
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => deleteQuiz(quiz.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default QuizList;

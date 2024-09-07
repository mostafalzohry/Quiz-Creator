import { useRouter } from "next/router";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useQuizContext } from "@/store/QuizContext";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-GB", options);
};

const QuizDetails = () => {
  const { quizzes } = useQuizContext();
  const router = useRouter();
  const { quizId } = router.query;

  const quiz = quizzes.find((q) => q.id === Number(quizId));

  if (!quiz) return <p>Quiz not found</p>;

  return (
    <Container className="my-5">
      <h1 className="mb-4">{quiz.title}</h1>
      <div className="mb-4">
        <span className="text-muted">
          Created on: {formatDate(quiz.created)}
        </span>
        <Card.Text className="mt-2">
          {quiz.description || "No description available"}
        </Card.Text>
      </div>
      <Row xs={1} md={2} lg={3} className="g-4">
        {quiz.questions_answers.map((question, index) => (
          <Col key={question.id || index} md={6} className="mb-4">
            <Card>
              <Card.Header>
                <Row className="align-items-center">
                  <Col>
                    <Card.Title>{question.text}</Card.Title>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                {question.answers.map((answer, idx) => (
                  <div
                    key={answer.id || idx}
                    className={`border ${
                      answer.is_true
                        ? "bg-success text-white"
                        : "bg-light text-dark"
                    } px-2 py-1 rounded mb-2`}
                  >
                    {answer.text}
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default QuizDetails;

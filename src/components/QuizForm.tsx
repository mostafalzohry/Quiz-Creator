import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuizContext } from "@/store/QuizContext";
import { Quiz } from "@/types/types";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const youtubeRegex =
  /^((https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|playlist\?list=)|youtu\.be\/))([a-zA-Z0-9_-]{11})$/;

const quizSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  url: yup
    .string()
    .matches(youtubeRegex, "Enter a valid YouTube URL")
    .required("Video URL is required"),
  questions_answers: yup
    .array()
    .of(
      yup.object().shape({
        text: yup.string().required("Question text is required"),
        feedback_true: yup
          .string()
          .required("Feedback for correct answer is required"),
        feedback_false: yup
          .string()
          .required("Feedback for incorrect answer is required"),
        answers: yup
          .array()
          .of(
            yup.object().shape({
              text: yup.string().required("Answer text is required"),
              is_true: yup.boolean().required("Is true is required"),
            })
          )
          .required("Answers are required"),
      })
    )
    .required("Questions are required"),
});

interface QuizFormProps {
  initialQuiz?: Quiz;
}

interface QuizFormData {
  title: string;
  description: string;
  url: string;
  questions_answers: {
    text: string;
    feedback_true: string;
    feedback_false: string;
    answers: {
      text: string;
      is_true: boolean;
    }[];
  }[];
}

const QuizForm = ({ initialQuiz }: QuizFormProps) => {
  const { addQuiz, editQuiz } = useQuizContext();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<QuizFormData>({
    resolver: yupResolver(quizSchema),
    defaultValues: initialQuiz || {
      title: "",
      description: "",
      url: "",
      questions_answers: [
        {
          text: "",
          feedback_true: "",
          feedback_false: "",
          answers: [{ text: "", is_true: false }],
        },
      ],
    },
  });

  const onSubmit: SubmitHandler<QuizFormData> = (data) => {
    const currentDate = new Date().toISOString();
    if (initialQuiz && initialQuiz.id) {
      editQuiz({
        ...initialQuiz,
        ...data,
        modified: currentDate,
      });
    } else {
      addQuiz({
        ...data,
        id: Date.now(),
        created: currentDate,
        modified: currentDate,
      });
    }
    router.push("/");
  };

  const handleAnswerChange = (
    questionIndex: number,
    answerIndex: number,
    field: any,
    updatedAnswer: any
  ) => {
    const updatedAnswers = field.value[questionIndex].answers.map(
      (answer: any, index: number) =>
        index === answerIndex ? updatedAnswer : { ...answer, is_true: false }
    );
    const updatedQuestions = field.value.map((question: any, index: number) =>
      index === questionIndex
        ? { ...question, answers: updatedAnswers }
        : question
    );
    field.onChange(updatedQuestions);
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">
        {initialQuiz ? "Edit Quiz" : "Create New Quiz"}
      </h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="title" className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            {...register("title")}
            isInvalid={!!errors.title}
          />
          <Form.Control.Feedback type="invalid">
            {errors.title?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            {...register("description")}
            isInvalid={!!errors.description}
          />
          <Form.Control.Feedback type="invalid">
            {errors.description?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="url" className="mb-4">
          <Form.Label>Video URL</Form.Label>
          <Form.Control
            type="url"
            {...register("url")}
            isInvalid={!!errors.url}
          />
          <Form.Control.Feedback type="invalid">
            {errors.url?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Controller
          name="questions_answers"
          control={control}
          render={({ field }) => (
            <div>
              {field.value.map((question: any, questionIndex: number) => (
                <div key={questionIndex} className="mb-4 p-3 border rounded">
                  <h4>Question {questionIndex + 1}</h4>
                  <Form.Group
                    controlId={`question-${questionIndex}-text`}
                    className="mb-3"
                  >
                    <Form.Label>Question Text</Form.Label>
                    <Form.Control
                      type="text"
                      value={question.text}
                      onChange={(e) => {
                        const updatedQuestions = [...field.value];
                        updatedQuestions[questionIndex].text = e.target.value;
                        field.onChange(updatedQuestions);
                      }}
                    />
                  </Form.Group>
                  <Form.Group
                    controlId={`question-${questionIndex}-feedback_true`}
                    className="mb-3"
                  >
                    <Form.Label>Feedback for Correct Answer</Form.Label>
                    <Form.Control
                      type="text"
                      value={question.feedback_true}
                      onChange={(e) => {
                        const updatedQuestions = [...field.value];
                        updatedQuestions[questionIndex].feedback_true =
                          e.target.value;
                        field.onChange(updatedQuestions);
                      }}
                    />
                  </Form.Group>
                  <Form.Group
                    controlId={`question-${questionIndex}-feedback_false`}
                    className="mb-3"
                  >
                    <Form.Label>Feedback for Incorrect Answer</Form.Label>
                    <Form.Control
                      type="text"
                      value={question.feedback_false}
                      onChange={(e) => {
                        const updatedQuestions = [...field.value];
                        updatedQuestions[questionIndex].feedback_false =
                          e.target.value;
                        field.onChange(updatedQuestions);
                      }}
                    />
                  </Form.Group>
                  {question.answers.map((answer: any, answerIndex: number) => (
                    <Form.Group key={answerIndex} className="mb-2">
                      <Form.Label>Answer {answerIndex + 1}</Form.Label>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="text"
                          value={answer.text}
                          onChange={(e) =>
                            handleAnswerChange(
                              questionIndex,
                              answerIndex,
                              field,
                              { ...answer, text: e.target.value }
                            )
                          }
                        />
                        <Form.Check
                          type="checkbox"
                          label="Correct Answer"
                          checked={answer.is_true}
                          onChange={() =>
                            handleAnswerChange(
                              questionIndex,
                              answerIndex,
                              field,
                              { ...answer, is_true: !answer.is_true }
                            )
                          }
                          className="ms-2"
                        />
                      </div>
                    </Form.Group>
                  ))}
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      const updatedQuestions = [...field.value];
                      updatedQuestions[questionIndex].answers.push({
                        text: "",
                        is_true: false,
                      });
                      field.onChange(updatedQuestions);
                    }}
                  >
                    Add Answer
                  </Button>
                </div>
              ))}
              <Button
                variant="outline-success"
                onClick={() => {
                  field.onChange([
                    ...field.value,
                    {
                      text: "",
                      feedback_true: "",
                      feedback_false: "",
                      answers: [{ text: "", is_true: false }],
                    },
                  ]);
                }}
              >
                Add Question
              </Button>
            </div>
          )}
        />

        <Button type="submit" variant="primary" className="mt-4">
          {initialQuiz ? "Save Changes" : "Add Quiz"}
        </Button>
      </Form>
    </Container>
  );
};

export default QuizForm;

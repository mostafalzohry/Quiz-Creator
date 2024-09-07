import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuizContext } from "@/store/QuizContext";
import { Quiz } from "@/types/types";
import { Container, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const youtubeRegex =
  /^((https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|playlist\?list=)|youtu\.be\/))([a-zA-Z0-9_-]{11})$/;

const quizSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(20, "Description must be at least 20 characters"),
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
              is_true: yup.boolean().required(),
            })
          )
          .min(2, "Each question should have at least two answers")
          .test(
            "one-correct-answer",
            "Each question must have exactly one correct answer",
            (answers) =>
              answers?.filter((answer) => answer.is_true).length === 1
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
      id: number;
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
    resolver: yupResolver(quizSchema as any),
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
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<QuizFormData> = (data) => {
    const currentDate = new Date().toISOString();
    if (initialQuiz && initialQuiz.id) {
      editQuiz({
        id: initialQuiz.id,
        title: data.title,
        description: data.description,
        url: data.url,
        questions_answers: data.questions_answers.map((question, index) => ({
          id: initialQuiz.questions_answers[index]?.id || Date.now(),
          text: question.text,
          feedback_true: question.feedback_true,
          feedback_false: question.feedback_false,
          answer_id: question.answers.find((a) => a.is_true)?.id || null,
          answers: question.answers.map((answer, aIndex) => ({
            id:
              initialQuiz.questions_answers[index]?.answers[aIndex]?.id ||
              Date.now(),
            text: answer.text,
            is_true: answer.is_true,
          })),
        })),
        created: initialQuiz.created,
        modified: currentDate,
        score: initialQuiz.score,
      });
    } else {
      addQuiz({
        id: Date.now(),
        title: data.title,
        description: data.description,
        url: data.url,
        questions_answers: data.questions_answers.map((question) => ({
          id: Date.now(),
          text: question.text,
          feedback_true: question.feedback_true,
          feedback_false: question.feedback_false,
          answer_id: question.answers.find((a) => a.is_true)?.id || null,
          answers: question.answers.map((answer) => ({
            id: Date.now(),
            text: answer.text,
            is_true: answer.is_true,
          })),
        })),
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
    const updatedQuestions = field.value.map(
      (question: any, qIndex: number) => {
        if (qIndex === questionIndex) {
          const updatedAnswers = question.answers.map(
            (answer: any, aIndex: number) => {
              if (aIndex === answerIndex) {
                return updatedAnswer;
              }
              if (updatedAnswer.is_true && aIndex !== answerIndex) {
                return { ...answer, is_true: false };
              }
              return answer;
            }
          );
          return { ...question, answers: updatedAnswers };
        }
        return question;
      }
    );
    field.onChange(updatedQuestions);
  };

  const generateUniqueId = () => Date.now();

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
                      isInvalid={
                        !!errors.questions_answers?.[questionIndex]?.text
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.questions_answers?.[questionIndex]?.text?.message}
                    </Form.Control.Feedback>
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
                      isInvalid={
                        !!errors.questions_answers?.[questionIndex]
                          ?.feedback_true
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {
                        errors.questions_answers?.[questionIndex]?.feedback_true
                          ?.message
                      }
                    </Form.Control.Feedback>
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
                      isInvalid={
                        !!errors.questions_answers?.[questionIndex]
                          ?.feedback_false
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {
                        errors.questions_answers?.[questionIndex]
                          ?.feedback_false?.message
                      }
                    </Form.Control.Feedback>
                  </Form.Group>

                  {question.answers.map((answer: any, answerIndex: number) => (
                    <div key={answerIndex} className="mb-3 p-2 border rounded">
                      <div className="d-flex align-items-center">
                        <Form.Group
                          controlId={`question-${questionIndex}-answer-${answerIndex}-text`}
                          className="flex-grow-1 mb-0"
                        >
                          <Form.Label>Answer Text</Form.Label>
                          <Form.Control
                            type="text"
                            value={answer.text}
                            onChange={(e) => {
                              const updatedAnswer = {
                                ...answer,
                                text: e.target.value,
                              };
                              handleAnswerChange(
                                questionIndex,
                                answerIndex,
                                field,
                                updatedAnswer
                              );
                            }}
                            isInvalid={
                              !!errors.questions_answers?.[questionIndex]
                                ?.answers?.[answerIndex]?.text
                            }
                            style={{
                              borderColor:
                                initialQuiz && answer.is_true
                                  ? "green"
                                  : initialQuiz && !answer.is_true
                                  ? "red"
                                  : "",
                              borderWidth: initialQuiz ? "2px" : "",
                              borderStyle: initialQuiz ? "solid" : "",
                            }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {
                              errors.questions_answers?.[questionIndex]
                                ?.answers?.[answerIndex]?.text?.message
                            }
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          controlId={`question-${questionIndex}-answer-${answerIndex}-is_true`}
                          className="ms-3 mb-0"
                        >
                          <Form.Check
                            type="checkbox"
                            label="Correct Answer"
                            checked={answer.is_true}
                            onChange={() => {
                              const updatedAnswer = {
                                ...answer,
                                is_true: !answer.is_true,
                              };
                              handleAnswerChange(
                                questionIndex,
                                answerIndex,
                                field,
                                updatedAnswer
                              );
                            }}
                          />
                        </Form.Group>
                      </div>
                    </div>
                  ))}

                  {errors.questions_answers?.[questionIndex]?.answers
                    ?.message && (
                    <div className="text-danger">
                      {
                        errors.questions_answers?.[questionIndex]?.answers
                          ?.message
                      }
                    </div>
                  )}

                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      const updatedQuestions = [...field.value];
                      updatedQuestions[questionIndex].answers.push({
                        id: generateUniqueId(),
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
                      answers: [
                        { id: generateUniqueId(), text: "", is_true: false },
                      ],
                    },
                  ]);
                }}
              >
                Add Question
              </Button>
            </div>
          )}
        />

        <div className="text-center mt-4">
          <Button type="submit" variant="primary">
            {initialQuiz ? "Update Quiz" : "Create Quiz"}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default QuizForm;

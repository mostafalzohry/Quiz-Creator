
import { useRouter } from "next/router";
import QuizForm from "../../components/QuizForm";
import { useEffect, useState } from "react";
import { useQuizContext } from "../../store/QuizContext";
import { Quiz } from "../../types/types";

const EditQuiz = () => {
  const router = useRouter();
  const { id } = router.query;
  const { quizzes } = useQuizContext();
  const [initialQuiz, setInitialQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    if (id) {
      const quizToEdit = quizzes.find((quiz) => quiz.id === Number(id));
      console.log('Quiz to edit:', quizToEdit);
      if (quizToEdit) {
        setInitialQuiz(quizToEdit);
      } else {
        router.push("/404");
      }
    }
  }, [id, quizzes]);
  
  if (!initialQuiz) return <p>Loading...</p>;

  return (
    <div>
      <QuizForm initialQuiz={initialQuiz} />
    </div>
  );
};

export default EditQuiz;

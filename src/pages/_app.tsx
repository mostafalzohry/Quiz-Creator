import { QuizProvider } from "@/store/QuizContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QuizProvider>
      <Component {...pageProps} />
    </QuizProvider>
  );
}

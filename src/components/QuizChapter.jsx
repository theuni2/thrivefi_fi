"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Award,
  ChevronRight,
  Loader2,
} from "lucide-react";

export default function QuizChapter({
  quizData,
  courseSlug,
  onQuizComplete,
  isCompleted,
  onContinue,
}) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quizStatus, setQuizStatus] = useState(null);

  // Check if quiz was already submitted
  useEffect(() => {
    async function checkQuizStatus() {
      try {
        const res = await fetch("/api/user/enrollments");
        if (res.ok) {
          const data = await res.json();
          const enrollment = data.enrollments?.find(
            (e) => e.courseSlug === courseSlug
          );

          if (enrollment) {
            const quizScore = enrollment.quizScores?.find(
              (q) => q.quizId === quizData.quizId
            );
            if (quizScore) {
              setQuizStatus(quizScore);
              setSubmitted(true);
              setScore(quizScore.score);
            }
          }
        }
      } catch (error) {
        console.error("Failed to check quiz status", error);
      } finally {
        setLoading(false);
      }
    }

    checkQuizStatus();
  }, [courseSlug, quizData.quizId]);

  const handleAnswerChange = (questionId, optionIndex) => {
    if (submitted) return; // Prevent changes after submission
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const allAnswered = quizData.questions.every(
      (q) => answers[q.id] !== undefined
    );

    if (!allAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setSubmitting(true);

    // Calculate score
    let correctCount = 0;
    quizData.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const totalQuestions = quizData.questions.length;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    setScore(scorePercentage);
    setSubmitted(true);
    setSubmitting(false);

    // Note: We don't save to database here anymore
    // Score is only saved when user clicks "Mark as Completed"
  };

  const handleRetakeQuiz = () => {
    // Reset quiz state to allow retaking
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMarkComplete = async () => {
    console.log("Mark as Complete clicked", {
      score,
      passingScore: quizData.passingScore,
      isPassed,
    });

    if (score === null || score < quizData.passingScore) {
      console.error("Validation failed:", {
        score,
        passingScore: quizData.passingScore,
      });
      alert(
        `You must pass the quiz before marking it as complete. Your score: ${score}%, Required: ${quizData.passingScore}%`
      );
      return;
    }

    try {
      setSubmitting(true);

      console.log("Submitting quiz to API:", {
        courseSlug,
        chapterId: quizData.chapterId,
        quizId: quizData.quizId,
        score,
      });

      // Save quiz score to database
      const res = await fetch("/api/courses/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug,
          chapterId: quizData.chapterId,
          quizId: quizData.quizId,
          score,
          totalQuestions: quizData.questions.length,
          answers,
        }),
      });

      console.log("API Response status:", res.status);

      if (res.ok) {
        const data = await res.json();
        console.log("Quiz saved successfully:", data);

        setQuizStatus({
          score,
          totalQuestions: quizData.questions.length,
          completedAt: new Date(),
        });

        // Notify parent component of completion
        if (onQuizComplete) {
          onQuizComplete(data);
        }
      } else {
        const errorData = await res.json();
        console.error("API Error:", errorData);
        alert(`Failed to save quiz: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Failed to mark quiz as complete", error);
      alert("Failed to save quiz completion. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-sm font-medium">Loading quiz...</p>
      </div>
    );
  }

  // Safety check for quiz data
  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    console.error("Quiz data is missing or invalid:", quizData);
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400">
        <AlertCircle className="w-10 h-10 text-red-600 mb-4" />
        <p className="text-sm font-medium text-red-600">
          Quiz data could not be loaded
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Please check the console for details
        </p>
      </div>
    );
  }

  console.log("Quiz data loaded:", quizData);

  const isPassed = score !== null && score >= quizData.passingScore;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:px-12">
      {/* Quiz Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 p-3 rounded-xl">
            <Award className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {quizData.title}
            </h1>
            <p className="text-gray-600 mt-1">{quizData.instructions}</p>
          </div>
        </div>

        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-blue-900">
              Time Limit: {quizData.timeLimit}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
            <Award className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-green-900">
              Passing Score: {quizData.passingScore}%
            </span>
          </div>
        </div>

        {submitted && (
          <div
            className={`mt-4 p-4 rounded-xl border-2 ${
              isPassed
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {isPassed ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              <div>
                <h3
                  className={`font-bold text-lg ${
                    isPassed ? "text-green-900" : "text-red-900"
                  }`}
                >
                  {isPassed ? "Congratulations! You Passed!" : "Quiz Failed"}
                </h3>
                <p
                  className={`text-sm ${
                    isPassed ? "text-green-700" : "text-red-700"
                  }`}
                >
                  Your Score: {score}% ({quizData.questions.length} questions)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {quizData.questions.map((question, qIndex) => {
          const userAnswer = answers[question.id];
          const isCorrect = userAnswer === question.correctAnswer;
          const showFeedback = submitted;

          return (
            <div
              key={question.id}
              className={`p-6 rounded-xl border-2 transition-all ${
                showFeedback
                  ? isCorrect
                    ? "bg-green-50 border-green-200"
                    : userAnswer !== undefined
                    ? "bg-red-50 border-red-200"
                    : "bg-gray-50 border-gray-200"
                  : "bg-white border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex gap-3 mb-4">
                <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {qIndex + 1}
                </div>
                <h3 className="text-lg font-bold text-gray-900 flex-1">
                  {question.question}
                </h3>
                {showFeedback && (
                  <div className="shrink-0">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3 ml-11">
                {question.options.map((option, optIndex) => {
                  const isSelected = userAnswer === optIndex;
                  const isCorrectOption = optIndex === question.correctAnswer;
                  const showAsCorrect = showFeedback && isCorrectOption;
                  const showAsWrong = showFeedback && isSelected && !isCorrect;

                  return (
                    <label
                      key={optIndex}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        submitted
                          ? "cursor-not-allowed"
                          : "hover:border-blue-400 hover:bg-blue-50"
                      } ${
                        showAsCorrect
                          ? "bg-green-100 border-green-400"
                          : showAsWrong
                          ? "bg-red-100 border-red-400"
                          : isSelected
                          ? "bg-blue-100 border-blue-400"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        checked={isSelected}
                        onChange={() =>
                          handleAnswerChange(question.id, optIndex)
                        }
                        disabled={submitted}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span
                        className={`flex-1 font-medium ${
                          showAsCorrect
                            ? "text-green-900"
                            : showAsWrong
                            ? "text-red-900"
                            : "text-gray-800"
                        }`}
                      >
                        {option}
                      </span>
                      {showAsCorrect && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {showAsWrong && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </label>
                  );
                })}
              </div>

              {showFeedback && question.explanation && (
                <div className="mt-4 ml-11 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-blue-900 mb-1">
                        Explanation
                      </h4>
                      <p className="text-sm text-blue-800">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="mt-12 pt-8 border-t border-gray-200 flex justify-end gap-4">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-200"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Submit Quiz
              </>
            )}
          </button>
        ) : (
          <>
            {/* If quiz is already completed (saved in database), show Continue button */}
            {isCompleted && isPassed ? (
              onContinue && (
                <button
                  onClick={onContinue}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-indigo-200"
                >
                  Continue to Next Chapter
                  <ChevronRight className="w-5 h-5" />
                </button>
              )
            ) : (
              <>
                {/* If passed but not yet marked complete, show Mark as Completed button */}
                {isPassed && !isCompleted && (
                  <button
                    onClick={handleMarkComplete}
                    disabled={submitting}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-green-200"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Mark as Completed
                      </>
                    )}
                  </button>
                )}
                {/* If failed, show Retake Quiz button */}
                {!isPassed && (
                  <button
                    onClick={handleRetakeQuiz}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-orange-200"
                  >
                    <AlertCircle className="w-5 h-5" />
                    Retake Quiz
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

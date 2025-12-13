"use client";

import { useState, useEffect, useMemo } from "react";
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
  const [isSubmitted, setIsSubmitted] = useState(false); // Can be just saved, not necessarily chapter complete
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // Feedback message

  // Normalize questions based on varying data structures
  const normalizedQuestions = useMemo(() => {
    if (!quizData) return [];
    if (quizData.questions) return quizData.questions;
    if (quizData.scenario) return [quizData.scenario];
    if (quizData.clients) {
      return quizData.clients.map((client) => ({
        id: client.id,
        isClientProfile: true, // Marker for custom rendering if needed
        question: (
          <div className="space-y-1">
            <h4 className="font-bold text-lg text-indigo-900">{client.name}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
              <div className="bg-gray-50 p-2 rounded">
                <strong>Age:</strong> {client.age}
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <strong>Goal:</strong> {client.goal}
              </div>
              {client.timeHorizon && (
                <div className="bg-gray-50 p-2 rounded">
                  <strong>Time Horizon:</strong> {client.timeHorizon}
                </div>
              )}
              {client.riskTolerance && (
                <div className="bg-gray-50 p-2 rounded">
                  <strong>Risk Tolerance:</strong> {client.riskTolerance}
                </div>
              )}
            </div>
            <p className="text-sm font-medium text-gray-500 mt-2">
              Recommended Portfolio:
            </p>
          </div>
        ),
      }));
    }
    return [];
  }, [quizData]);

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
              setIsSubmitted(true);
              setScore(quizScore.score);
              if (quizScore.answers) {
                setAnswers(quizScore.answers);
              }
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

  const handleAnswerChange = (questionId, value) => {
    if (isSubmitted) return; // Prevent changes after submission
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    const isTextSubmit = quizData.type === "text-submit";

    // Check if all questions are answered
    const allAnswered = normalizedQuestions.every((q) => {
      const ans = answers[q.id];
      if (isTextSubmit) {
        return ans && ans.trim().length > 0;
      }
      return ans !== undefined;
    });

    if (!allAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setSubmitting(true);

    // Default score
    let calculatedScore = 100;

    if (!isTextSubmit) {
      // Calculate score for multiple choice
      let correctCount = 0;
      normalizedQuestions.forEach((q) => {
        if (answers[q.id] === q.correctAnswer) {
          correctCount++;
        }
      });

      const totalQuestions = normalizedQuestions.length;
      calculatedScore = Math.round((correctCount / totalQuestions) * 100);
    }

    setScore(calculatedScore);

    // If text submit, we SAVE first (saveOnly=true), user must explicitly Complete later
    // If multiple choice, we can probably just do standard flow or same?
    // User requested "get the button to mark the chapter as completed" for input type.
    // For consistency let's use saveOnly for text-submit types.

    try {
      const res = await fetch("/api/courses/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug,
          chapterId: quizData.chapterId,
          quizId: quizData.quizId,
          score: calculatedScore,
          totalQuestions: normalizedQuestions.length,
          answers,
          saveOnly: isTextSubmit, // Only save answers, don't mark chapter complete yet
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
        setMessage(isTextSubmit ? "Responses saved successfully." : null);
        if (!isTextSubmit) {
          // For MCQ we might want to trigger completion if passed right away?
          // But sticking to the pattern: Submit -> (if passed) Mark Complete / Continue.
          // Actually existing logic for MCQ was auto-check.
          // Let's keep it simple: Text Submit -> Save Only.
        }
      } else {
        const err = await res.json();
        alert("Failed to submit: " + (err.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Submit error", err);
      alert("Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetakeQuiz = () => {
    setAnswers({});
    setIsSubmitted(false);
    setScore(null);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMarkComplete = async () => {
    const isTextSubmit = quizData.type === "text-submit";

    // Validate score only if NOT text-submit
    if (!isTextSubmit && (score === null || score < quizData.passingScore)) {
      alert(
        `You must pass the quiz before marking it as complete. Your score: ${score}%, Required: ${quizData.passingScore}%`
      );
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/courses/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug,
          chapterId: quizData.chapterId,
          quizId: quizData.quizId,
          score: score || 100,
          totalQuestions: normalizedQuestions.length,
          answers,
          saveOnly: false, // Explicitly complete the chapter
        }),
      });

      if (res.ok) {
        const data = await res.json();

        if (onQuizComplete) {
          onQuizComplete(data);
        }
      } else {
        const errorData = await res.json();
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

  if (!normalizedQuestions || normalizedQuestions.length === 0) {
    console.error("Quiz data is missing or invalid:", quizData);
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400">
        <AlertCircle className="w-10 h-10 text-red-600 mb-4" />
        <p className="text-sm font-medium text-red-600">
          Quiz data could not be loaded
        </p>
      </div>
    );
  }

  const isTextSubmit = quizData.type === "text-submit";
  const isPassed = isTextSubmit
    ? isSubmitted
    : score !== null && score >= quizData.passingScore;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:px-12">
      {/* Quiz Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 p-3 rounded-xl">
            <Award className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-900">
              {quizData.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-600 mt-1">
              {quizData.instructions}
            </p>
          </div>
        </div>

        {/* Extra info for scenario or clients */}
        {quizData.portfolioTypes && (
          <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <h4 className="font-bold text-indigo-900 mb-2">
              Reference Portfolios:
            </h4>
            <div className="grid gap-3 sm:grid-cols-3">
              {quizData.portfolioTypes.map((pt, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="font-bold text-indigo-700">{pt.type}</div>
                  <div className="text-sm text-gray-600">{pt.allocation}</div>
                  {pt.risk && (
                    <div className="text-xs text-gray-400 mt-1">{pt.risk}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 text-sm">
          {quizData.passingScore && (
            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
              <Award className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-900">
                Passing Score: {quizData.passingScore}%
              </span>
            </div>
          )}
        </div>

        {isSubmitted && (
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
                  {isPassed
                    ? isTextSubmit
                      ? "Activity Completed"
                      : "Congratulations! You Passed!"
                    : "Quiz Failed"}
                </h3>
                {message && (
                  <p className="text-green-700 font-medium mt-1">{message}</p>
                )}
                {!isTextSubmit && (
                  <p
                    className={`text-sm ${
                      isPassed ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    Your Score: {score}% ({normalizedQuestions.length}{" "}
                    questions)
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {normalizedQuestions.map((question, qIndex) => {
          const userAnswer = answers[question.id];

          let cardStyle =
            "bg-white border-gray-200 dark:border-gray-400 hover:border-blue-300";
          if (isSubmitted) {
            if (isTextSubmit) {
              cardStyle =
                "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
            } else {
              const isCorrect = userAnswer === question.correctAnswer;
              cardStyle = isCorrect
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
            }
          }

          return (
            <div
              key={question.id}
              className={`p-6 rounded-xl border-2 transition-all ${cardStyle}`}
            >
              <div className="flex gap-3 mb-4">
                <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {qIndex + 1}
                </div>
                <div className="text-lg text-gray-900 dark:text-gray-800 flex-1">
                  {/* Handle both string questions and React Node questions (from clients) */}
                  {question.question}
                </div>
                {isSubmitted && !isTextSubmit && (
                  <div className="shrink-0">
                    {userAnswer === question.correctAnswer ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                )}
              </div>

              <div className="ml-11">
                {isTextSubmit ? (
                  !isSubmitted && (
                    <textarea
                      className={`w-full p-4 rounded-lg border-2 focus:ring-0 focus:outline-none transition-all border-gray-200 dark:border-gray-400 focus:border-blue-400 focus:bg-blue-50 dark:focus:bg-blue-50 bg-white dark:bg-white text-gray-900 dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-500`}
                      rows={4}
                      placeholder="Type your answer here..."
                      value={userAnswer || ""}
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                      disabled={isSubmitted}
                    />
                  )
                ) : (
                  <div className="space-y-3">
                    {question.options?.map((option, optIndex) => {
                      const isSelected = userAnswer === optIndex;
                      const isCorrectOption =
                        optIndex === question.correctAnswer;
                      const showAsCorrect = isSubmitted && isCorrectOption;
                      const showAsWrong =
                        isSubmitted && isSelected && !isCorrectOption;

                      return (
                        <label
                          key={optIndex}
                          className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            isSubmitted
                              ? "cursor-not-allowed"
                              : "hover:border-blue-400 hover:bg-blue-50"
                          } ${
                            showAsCorrect
                              ? "bg-green-100 border-green-400"
                              : showAsWrong
                              ? "bg-red-100 border-red-400"
                              : isSelected
                              ? "bg-blue-100 border-blue-400"
                              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={isSelected}
                            onChange={() =>
                              handleAnswerChange(question.id, optIndex)
                            }
                            disabled={isSubmitted}
                            className="w-5 h-5 text-blue-600"
                          />
                          <span
                            className={`flex-1 font-medium ${
                              showAsCorrect
                                ? "text-green-900 dark:text-green-300"
                                : showAsWrong
                                ? "text-red-900 dark:text-red-300"
                                : "text-gray-800 dark:text-gray-200"
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
                )}
              </div>

              {isSubmitted && question.explanation && (
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
        {!isSubmitted ? (
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
                {!isPassed && !isTextSubmit && (
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

import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseSlug: {
      type: String,
      required: true,
    },
    completedChapters: {
      type: [String], // Array of chapter IDs or numbers
      default: [],
    },
    quizScores: {
      type: [
        {
          quizId: String,
          chapterId: String,
          score: Number,
          totalQuestions: Number,
          completedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent duplicate enrollments for same user/course
EnrollmentSchema.index({ user: 1, courseSlug: 1 }, { unique: true });

export default mongoose.models.Enrollment ||
  mongoose.model("Enrollment", EnrollmentSchema);

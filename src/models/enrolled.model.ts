import mongoose from "mongoose";

const enrolledSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Please provide a course"],
    },
    lessons: [
      {
        course_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "Please provide a course id"],
        },
        completed: { type: Boolean, default: false },
        notes: String,
      },
    ],
    progress: { type: Number, default: 0, min: 0, max: 100 },
    exams: {
      type: [
        {
          exam_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
            required: [true, "Please provide an exam id"],
          },
          completed: { type: Boolean, default: false },
          score: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
    completed: { type: Boolean, default: false },
    certificateRequested: { type: Date, default: null },
    certificate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certificate",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export type EnrolledType = mongoose.InferSchemaType<typeof enrolledSchema>;

export default mongoose.model("Enrolled", enrolledSchema);

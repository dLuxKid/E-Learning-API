import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Please provide a course"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    duration: {
      type: Number,
      required: [true, "Please provide a duration"],
      min: 0,
    },
    questions: {
      type: [
        {
          question: {
            type: String,
            required: [true, "Please provide a question"],
          },
          options: {
            type: [String],
            required: [true, "Please provide options"],
          },
          answer: {
            type: String,
            required: [true, "Please provide an answer"],
            select: false,
          },
        },
      ],
      required: [true, "Please provide exam questions"],
    },
  },
  { timestamps: true }
);

export type ExamType = mongoose.InferSchemaType<typeof examSchema>;
export default mongoose.model("Exam", examSchema);

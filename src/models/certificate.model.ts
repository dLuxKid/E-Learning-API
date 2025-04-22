import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
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
    certificateUrl: {
      type: String,
      required: [true, "Please provide a certificate URL"],
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    expiredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export type CertificateType = mongoose.InferSchemaType<
  typeof certificateSchema
>;
export default mongoose.model("Certificate", certificateSchema);

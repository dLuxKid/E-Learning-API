import mongoose from "mongoose";
import slugify from "slugify";

const courseItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a course item title"],
  },
  description: {
    type: String,
    required: [true, "Please provide a course item description"],
  },
  thumbnail: {
    type: String,
    required: [true, "Please provide a course item thumbnail"],
  },
  video: {
    type: String,
    required: [true, "Please provide a course item video url"],
  },
  notes: String,
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a course title"],
    },
    description: {
      type: String,
      required: [true, "Please provide a course description"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    duration: {
      type: Number,
      required: [true, "Please provide a course duration"],
      min: 0,
    },
    availability: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
      required: [true, "Please provide a course availability"],
    },
    category: {
      type: String,
      required: [true, "Please provide a course category"],
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: [true, "Please provide a course level"],
    },
    prerequisites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Course",
      default: [],
    },
    thumbnail: {
      type: String,
      required: [true, "Please provide a course thumbnail"],
    },
    tags: {
      type: [String],
      default: [],
    },
    lessons: {
      type: [courseItemSchema],
      required: [true, "Please provide course items"],
    },
    ratings: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
      set: (val: number) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseSchema.index({ createdAt: -1 });
courseSchema.index({ ratings: -1 });

courseSchema.virtual("enrolled", {
  ref: "Enrolled",
  localField: "_id",
  foreignField: "course",
});

courseSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "course",
});

courseSchema.pre(/^find/, function (next) {
  (this as any).populate({
    path: "instructor",
    select: "username email profile_picture _id",
  });
  next();
});

courseSchema.pre("save", async function (next) {
  (this as any).slug = slugify(this.title, {
    lower: true,
  });
});

export type CourseType = mongoose.InferSchemaType<typeof courseSchema>;

export default mongoose.model("Course", courseSchema);

import mongoose from "mongoose";
import courseModel from "./course.model";

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "please write a review"],
      min: 4,
    },
    rating: {
      type: Number,
      min: [1, "Rating must be greater than 1"],
      max: [5, "Rating must not be greater than 5"],
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
      required: [true, "review must belong to a course"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "review must belong to a user"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ course: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  (this as any).populate({
    path: "user",
    select: "username profile_picture",
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (course_id: string) {
  const stats = await this.aggregate([
    { $match: { course: course_id } },
    {
      $group: {
        _id: "$course",
        nRatings: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0)
    await courseModel.findByIdAndUpdate(course_id, {
      ratings: stats[0].avgRating,
      ratingsQuantity: stats[0].nRatings,
    });
  else
    await courseModel.findByIdAndUpdate(course_id, {
      ratings: 4.5,
      ratingsQuantity: 0,
    });
};
reviewSchema.post("save", function () {
  (this.constructor as any).calcAverageRatings(this.course);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  const doc = await (this as any).findOne();
  (this as any).r = doc;
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await (this as any).r.constructor.calcAverageRatings((this as any).r.course);
});

export default mongoose.model("Review", reviewSchema);

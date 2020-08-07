// Libraries
import Mongoose from 'mongoose';

// Project files
import { IReview } from '@app/types';

type IReviewModel = IReview & Mongoose.Document;

const ReviewSchema = new Mongoose.Schema<IReview>({
  rating: { type: Mongoose.Schema.Types.Number, required: true },
  productId: { type: Mongoose.Schema.Types.ObjectId, required: true },
  description: { type: Mongoose.Schema.Types.String, required: false },
  ownerId: { type: Mongoose.Schema.Types.ObjectId, required: true },
}, { timestamps: true });

const Review = Mongoose.model<IReviewModel>('review', ReviewSchema);
export default Review;
export interface IReview {
  rating: number;
  productId: string;
  description?: string;
  ownerId: string;
}

export interface IAddReviewBody {
  description?: string;
  productId: string;
  rating: number;
}
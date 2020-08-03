// Libraries
import Mongoose from 'mongoose';

// Project files
import { ICategory } from '@app/types';

type ICategoryModel = ICategory & Mongoose.Document;

const CategorySchema = new Mongoose.Schema<ICategory>({
  uuid: { type: Mongoose.Schema.Types.String, required: true },
  thumbnailImage: { type: Mongoose.Schema.Types.String, required: true },
  title: { type: Mongoose.Schema.Types.String, required: true },
  productsIds: [{ type: Mongoose.Schema.Types.ObjectId, required: false }],
}, { timestamps: true });

const Category = Mongoose.model<ICategoryModel>('category', CategorySchema);
export default Category;
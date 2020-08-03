// Libraries
import Mongoose from 'mongoose';

// Project files
import { IProduct } from '@app/types';

type IProductModel = IProduct & Mongoose.Document;

const ProductSchema = new Mongoose.Schema<IProduct>({
  productId: { type: Mongoose.Schema.Types.String, required: true },
  title: { type: Mongoose.Schema.Types.String, required: true },
  description: { type: Mongoose.Schema.Types.String, required: true },
  category: { type: Mongoose.Schema.Types.String, required: true },
  thumbnailImage: { type: Mongoose.Schema.Types.String, required: true },
  images: [{
    uuid: { type: Mongoose.Schema.Types.String, required: true },
    productId: { type: Mongoose.Schema.Types.String, required: true },
    src: { type: Mongoose.Schema.Types.String, required: true },
    mediaType: { type: Mongoose.Schema.Types.String, default: 'IMAGE' },
    variantIds: [{ type: Mongoose.Schema.Types.String, required: false }],
  }],
  variants: [{
    uuid: { type: Mongoose.Schema.Types.String, required: true },
    productId: { type: Mongoose.Schema.Types.String, required: true },
    title: { type: Mongoose.Schema.Types.String, required: true },
    barcode: { type: Mongoose.Schema.Types.String, required: true },
    originalPrice: { type: Mongoose.Schema.Types.Number, required: true },
    price: { type: Mongoose.Schema.Types.Number, required: true },
    weight: { type: Mongoose.Schema.Types.Number, required: true },
    weightUnit: { type: Mongoose.Schema.Types.String, default: 'KG' },
    isOutOfStock: { type: Mongoose.Schema.Types.Boolean, default: false },
  }],
  disabled: { type: Mongoose.Schema.Types.Boolean, default: false },
  vendor: { type: Mongoose.Schema.Types.String, required: true },
  originOfProduct: { type: Mongoose.Schema.Types.String, required: true },
}, { timestamps: true });

const Product = Mongoose.model<IProductModel>('product', ProductSchema);
export default Product;
// Libraries
import Mongoose from 'mongoose';

// Project files
import { IOrder } from '@app/types';

type IOrderModel = IOrder & Mongoose.Document;

const OrderSchema = new Mongoose.Schema<IOrder>({
  customerId: { type: Mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
  orderId: { type: Mongoose.Schema.Types.String, required: true },
  products: [{
    variantId: { type: Mongoose.Schema.Types.String, required: true },
    productId: { type: Mongoose.Schema.Types.String, required: true },
    quantity: { type: Mongoose.Schema.Types.Number, required: true },
    title: { type: Mongoose.Schema.Types.String, required: true },
    barcode: { type: Mongoose.Schema.Types.String, required: true },
    originalPrice: { type: Mongoose.Schema.Types.Number, required: true },
    price: { type: Mongoose.Schema.Types.Number, required: true },
    weight: { type: Mongoose.Schema.Types.Number, required: true },
    weightUnit: { type: Mongoose.Schema.Types.String, default: 'KG' },
    isOutOfStock: { type: Mongoose.Schema.Types.Boolean, default: false },
  }],
  shippingAddress: { type: Mongoose.Schema.Types.Mixed, required: true },
  deliveryMethod: { type: Mongoose.Schema.Types.String, required: true },
  orderStatus: { type: Mongoose.Schema.Types.Mixed, required: true },
  amount: { type: Mongoose.Schema.Types.Number, required: true },
}, { timestamps: true });

const Order = Mongoose.model<IOrderModel>('order', OrderSchema);
export default Order;
// Project files
import { IAddress } from '@app/types';
import { IProductWeightUnit } from './product.types';

export interface IOrder {
  customerId: string;
  orderId: string;
  products: IOrderItem[];
  shippingAddress: IAddress;
  deliveryMethod: IDeliveryMethod;
  orderStatus: {
    [status: string]: {
      type: IOrderStatus;
      createdAt: Date;
      updatedAt: Date;
      description?: string;
    }
  };
  amount: number;
}

export interface IOrderItem {
  variantId: string;
  productId: string;
  title: string;
  barcode: string;
  originalPrice: number;
  price: number;
  weight: number;
  weightUnit: IProductWeightUnit;
  quantity: number;
}

export type IDeliveryMethod = 'CASH ON DELIVERY' | 'STORE PICKUP';

export type IOrderStatus = 'ORDER_CREATED' | 'ORDER_SHIPPED' | 'ORDER_DECLINE' | 'ORDER_REFUND';

export interface ICreateOrderBody {
  shippingAddress: string;
  deliveryMethod: IDeliveryMethod;
  products: IOrderItem[];
}
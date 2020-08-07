// Libraries
import Koa from 'koa';
import { v4 as UuidV4 } from 'uuid';

// Project files
import { IController, ICreateOrderBody, IOrderItem, IProductVariant } from '@app/types';
import BaseController from '@app/api/v1/controllers/base.controller';
import { ERROR_CODE } from '@app/constants';
import { Product, User, Order } from '@app/models';
import Validator from '@app/helpers/validator.helpers';

class OrderController extends BaseController implements IController {
  constructor() {
    super();
    const BASE_PATH = '/order';
    this.routes.push({
      method: 'POST',
      path: `${BASE_PATH}`,
      handler: this.createOrder,
    });
    this.routes.push({
      method: 'GET',
      path: `${BASE_PATH}`,
      handler: this.getOrder,
    });
  }

  public createOrder = async (ctx: Koa.Context) => {
    const body: ICreateOrderBody = ctx.request.body;
    const formErrors: string[] = [];

    const user = await User.findOne({ email: ctx.request.auth.email }, { addresses: 1 });

    if (!user) {
      return this.UnAuthorized(ctx, 'Unauthorized request', ERROR_CODE.UNAUTHORIZED_REQUEST);
    }

    const shippingAddress = user.addresses?.find(x => x.uuid === body.shippingAddress);
    if (!shippingAddress) {
      formErrors.push('Invalid shipping address passed');
    }
    if (!(body.products || []).length) {
      formErrors.push('Products are required');
    } else {
      body.products.forEach((element, index) => {
        if (Validator.isEmpty(element.productId)) {
          formErrors.push(`Product id is required on ${index + 1} product`);
        }
        if (Validator.isEmpty(element.variantId)) {
          formErrors.push(`Variant id is required on ${index + 1} product`);
        }
        if (!Validator.isValidQuantity(String(element.quantity))) {
          formErrors.push(`Quantity should be more than 0 on ${index + 1} product`);
        }
      });
    }
    if (!(body.deliveryMethod === 'CASH ON DELIVERY' || body.deliveryMethod === 'STORE PICKUP')) {
      formErrors.push('Delivery method should be one these [CASH ON DELIVERY,STORE PICKUP]');
    }
    if (formErrors.length) {
      return this.BadRequest(ctx, 'Form is invalid', ERROR_CODE.INVALID_BODY, formErrors);
    }
    const variants: { [variantId: string]: IProductVariant } = {};
    const products = await Product.find(
      { productId: { $in: body.products.map(element => element.productId) } },
      {
        variants: 1,
      }
    );
    products.forEach(element => {
      (element.variants || []).forEach(variant => {
        variants[variant.uuid] = variant;
      })
    });

    const orderItems: IOrderItem[] = [];
    let amount: number = 0;
    body.products.forEach(element => {
      const item = variants[element.variantId];
      if (item) {
        orderItems.push({
          barcode: item.barcode,
          originalPrice: item.originalPrice,
          price: item.price,
          productId: item.productId,
          title: item.title,
          variantId: item.uuid,
          weight: item.weight,
          weightUnit: item.weightUnit,
          quantity: element.quantity,
        });
        amount += item.price * element.quantity;
      }
    });

    const order = await Order.create({
      amount,
      customerId: ctx.request.auth._id,
      deliveryMethod: body.deliveryMethod,
      orderId: UuidV4(),
      orderStatus: {
        'ORDER_CREATED': {
          type: 'ORDER_CREATED',
          createdAt: new Date(),
          updatedAt: new Date(),
          description: 'Your order has been placed.'
        }
      },
      products: orderItems,
      shippingAddress,
    });
    this.Ok(ctx, { order }, 'Order has been placed');
  }

  public getOrder = async (ctx: Koa.Context) => {
    const customerId = ctx.request.auth._id;
    const orders = await Order.find({ customerId });
    this.Ok(ctx, { orders }, 'Orders fetched');
  }
}

export default new OrderController();
// Libraries
import Koa from 'koa';
import { v4 as UuidV4 } from 'uuid';

// Project files
import { IController, IAddAddressBody, IAddress, IUpdateAddressBody } from '@app/types';
import BaseController from '@app/api/v1/controllers/base.controller';
import Validator from '@app/helpers/validator.helpers';
import { ERROR_CODE } from '@app/constants';
import { User, Product } from '@app/models';
import CommonHelper from '@app/helpers/common.helpers';

class UserController extends BaseController implements IController {
  constructor() {
    super();
    const BASE_PATH = '/user';
    this.routes.push({
      method: 'POST',
      path: `${BASE_PATH}/address`,
      handler: this.addAddress,
    });
    this.routes.push({
      method: 'GET',
      path: `${BASE_PATH}/address`,
      handler: this.getAddress,
    });
    this.routes.push({
      method: 'DELETE',
      path: `${BASE_PATH}/address`,
      handler: this.deleteAddress,
    });
    this.routes.push({
      method: 'PUT',
      path: `${BASE_PATH}/address`,
      handler: this.updateAddress,
    });
    this.routes.push({
      method: 'GET',
      path: `${BASE_PATH}/favourite`,
      handler: this.getFavouriteProducts,
    });
    this.routes.push({
      method: 'POST',
      path: `${BASE_PATH}/favourite`,
      handler: this.addToFavouriteProduct,
    });
    this.routes.push({
      method: 'DELETE',
      path: `${BASE_PATH}/favourite/:productId`,
      handler: this.removeFromFavouriteProduct,
    });
  }

  public addAddress = async (ctx: Koa.Context) => {
    const email = ctx.request.auth.email;
    const body: IAddAddressBody = ctx.request.body;

    const formErrors = [];

    Array.prototype.push.apply(formErrors, CommonHelper.validateAddress(body));

    if (formErrors.length) {
      return this.BadRequest(ctx, 'Form is invalid', ERROR_CODE.INVALID_BODY, formErrors);
    }

    const uuid = UuidV4();
    const address: IAddress = {
      address1: body.address1,
      address2: body.address2 || '',
      city: body.city,
      mobileNo: body.mobileNo,
      name: body.name,
      pincode: body.pincode,
      state: body.state,
      uuid,
      alternateMobileNo: body.alternateMobileNo || '',
      landmark: body.landmark || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      type: body.type,
    }

    await User.updateOne({ email }, { $push: { addresses: address } });
    this.Created(ctx, { address }, 'Address created');
  }

  public getAddress = async (ctx: Koa.Context) => {
    const email = ctx.request.auth.email;
    const user = await User.findOne({ email }, { addresses: 1 });
    this.Ok(ctx, { addresses: user.addresses }, 'Address fetched');
  }

  public deleteAddress = async (ctx: Koa.Context) => {
    const email = ctx.request.auth.email;
    const uuid = ctx.request.body.uuid;
    if (Validator.isEmpty(uuid)) {
      return this.BadRequest(ctx, 'Id is required');
    }
    await User.updateOne({ email }, { $pull: { addresses: { uuid } } });
    this.Ok(ctx, { message: 'Address removed' });
  }

  public updateAddress = async (ctx: Koa.Context) => {
    const email = ctx.request.auth.email;
    const body: IUpdateAddressBody = ctx.request.body;

    const formErrors = [];
    if (Validator.isEmpty(body.uuid)) {
      formErrors.push('Id is required');
    }
    Array.prototype.push.apply(formErrors, CommonHelper.validateAddress(body));

    if (formErrors.length) {
      return this.BadRequest(ctx, 'Form is invalid', ERROR_CODE.INVALID_BODY, formErrors);
    }

    const user = await User.findOne({ email }, { addresses: 1 });

    const addresses = user.addresses || [];
    const matchedAddressIndex = addresses.findIndex(element => element.uuid === body.uuid);
    if (matchedAddressIndex === -1) {
      return this.BadRequest(ctx, 'Address not found', ERROR_CODE.ADDRESS_NOT_FOUND);
    }

    const address: IAddress = {
      address1: body.address1,
      address2: body.address2 || '',
      city: body.city,
      mobileNo: body.mobileNo,
      name: body.name,
      pincode: body.pincode,
      state: body.state,
      uuid: body.uuid,
      alternateMobileNo: body.alternateMobileNo || '',
      landmark: body.landmark || '',
      createdAt: addresses[matchedAddressIndex].createdAt,
      updatedAt: new Date(),
      type: body.type,
    }

    addresses[matchedAddressIndex] = address;

    await User.updateOne({ email }, { $set: { addresses: [...addresses] } });
    return this.Ok(ctx, { address }, 'Address updated');
  }

  public getFavouriteProducts = async (ctx: Koa.Context) => {
    const user = await User.findOne({ email: ctx.request.auth.email });
    if (!user) {
      return this.UnAuthorized(ctx, 'Unauthorized request', ERROR_CODE.UNAUTHORIZED_REQUEST);
    }
    const favouritesProducts = user.favouritesProducts || {};
    const products = await Product.find({ productId: { $in: Object.keys(favouritesProducts) } });
    this.Ok(ctx, { products }, 'Favourite products fetched');
  }

  public addToFavouriteProduct = async (ctx: Koa.Context) => {
    const productId = ctx.request.body.productId;
    if (Validator.isEmpty(productId)) {
      return this.BadRequest(ctx, 'Form is invalid', ERROR_CODE.INVALID_BODY, ['Product is not valid']);
    }

    const user = await User.findOne({ email: ctx.request.auth.email });
    if (!user) {
      return this.UnAuthorized(ctx, 'Unauthorized request', ERROR_CODE.UNAUTHORIZED_REQUEST);
    }
    const favouritesProducts = user.favouritesProducts || {};
    favouritesProducts[productId] = true;
    await User.updateOne({ email: ctx.request.auth.email }, { $set: { favouritesProducts: { ...favouritesProducts } } });
    this.Ok(ctx, { message: 'Product added to favourite' });
  }

  public removeFromFavouriteProduct = async (ctx: Koa.Context) => {
    const productId = ctx.params.productId;
    if (Validator.isEmpty(productId)) {
      return this.BadRequest(ctx, 'Form is invalid', ERROR_CODE.INVALID_BODY, ['Product is not valid']);
    }
    const user = await User.findOne({ email: ctx.request.auth.email });
    if (!user) {
      return this.UnAuthorized(ctx, 'Unauthorized request', ERROR_CODE.UNAUTHORIZED_REQUEST);
    }
    const favouritesProducts = user.favouritesProducts || {};
    delete favouritesProducts[productId];
    await User.updateOne({ email: ctx.request.auth.email }, { $set: { favouritesProducts: { ...favouritesProducts } } });
    this.Ok(ctx, { message: 'Product removed from favourite' });
  }
}

export default new UserController();
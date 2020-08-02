// Libraries
import Koa from 'koa';
import { v4 as UuidV4 } from 'uuid';

// Project files
import { IController, IAddAddressBody, IAddress, IUpdateAddressBody } from '@app/types';
import BaseController from '@app/api/v1/controllers/base.controller';
import Validator from '@app/helpers/validator.helpers';
import { ERROR_CODE } from '@app/constants';
import { User } from '@app/models';

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
  }

  public addAddress = async (ctx: Koa.Context) => {
    const email = ctx.request.auth.email;
    const body: IAddAddressBody = ctx.request.body;

    const formErrors = [];
    if (Validator.isEmpty(body.address1)) {
      formErrors.push('Address1 is required');
    }
    if (Validator.isEmpty(body.city)) {
      formErrors.push('City is required');
    }
    if (Validator.isEmpty(body.name)) {
      formErrors.push('Name is required');
    }
    if (Validator.isEmpty(body.state)) {
      formErrors.push('State is required');
    }
    if (!Validator.isIndianNumber(body.mobileNo)) {
      formErrors.push('Mobile no is invalid');
    }
    if (body.alternateMobileNo && !Validator.isIndianNumber(body.alternateMobileNo)) {
      formErrors.push('Alternate mobile no is invalid');
    }
    if (!Validator.isValidPincode(String(body.pincode))) {
      formErrors.push('Pincode is invalid');
    }

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
    if (Validator.isEmpty(body.address1)) {
      formErrors.push('Address1 is required');
    }
    if (Validator.isEmpty(body.city)) {
      formErrors.push('City is required');
    }
    if (Validator.isEmpty(body.name)) {
      formErrors.push('Name is required');
    }
    if (Validator.isEmpty(body.state)) {
      formErrors.push('State is required');
    }
    if (!Validator.isIndianNumber(body.mobileNo)) {
      formErrors.push('Mobile no is invalid');
    }
    if (body.alternateMobileNo && !Validator.isIndianNumber(body.alternateMobileNo)) {
      formErrors.push('Alternate mobile no is invalid');
    }
    if (!Validator.isValidPincode(String(body.pincode))) {
      formErrors.push('Pincode is invalid');
    }

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
    }

    addresses[matchedAddressIndex] = address;

    await User.updateOne({ email }, { $set: { addresses: [...addresses] } });
    return this.Ok(ctx, { address }, 'Address updated');
  }
}

export default new UserController();
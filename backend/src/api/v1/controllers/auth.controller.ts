// Libraries
import Koa from 'koa';
import Config from 'config';
import JWT from 'jsonwebtoken';

// Project files
import { IController, ISignupBody, ILoginBody } from '@app/types';
import BaseController from '@app/api/v1/controllers/base.controller';
import Validator from '@app/helpers/validator.helpers';
import { ERROR_CODE } from '@app/constants';
import { User } from '@app/models';
import { EncryptionService } from '@app/services';

class AuthController extends BaseController implements IController {
  constructor() {
    super();
    const BASE_PATH = '/auth';
    this.routes.push({
      method: 'POST',
      path: `${BASE_PATH}/signup`,
      handler: this.handleSignup,
    });
    this.routes.push({
      method: 'POST',
      path: `${BASE_PATH}/login`,
      handler: this.handleLogin,
    });
  }

  public handleSignup = async (ctx: Koa.Context) => {
    const body: ISignupBody = ctx.request.body;
    const formErrors = [];

    if (Validator.isEmpty(body.firstName)) {
      formErrors.push('First name is required');
    }
    if (Validator.isEmpty(body.lastName)) {
      formErrors.push('Last name is required');
    }
    if (!Validator.isEmail(body.email)) {
      formErrors.push('Email is invalid');
    }
    if (!Validator.isValidPassword(body.password)) {
      formErrors.push('Password is invalid');
    }
    if (!Validator.isIndianNumber(body.mobileNo)) {
      formErrors.push('Phone number is invalid');
    }

    if (formErrors.length) {
      return this.BadRequest(ctx, 'Form is invalid', ERROR_CODE.INVALID_BODY, formErrors);
    }

    const isAlreadyExists = await User.findOne({ email: body.email });
    if (isAlreadyExists) {
      return this.BadRequest(ctx, 'User already exists', ERROR_CODE.USER_ALREADY_EXISTS);
    }

    const passwordHash = EncryptionService.encode(body.password);
    const expiresIn = Date.now() + (typeof process.env.JWT_EXPIRE === 'undefined' ? Config.get<number>('JWT_EXPIRE') : Number(process.env.JWT_EXPIRE));
    const JWT_SECRET = process.env.JWT_SECRET ?? Config.get('JWT_SECRET');

    const user = await User.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      mobileNo: body.mobileNo,
      password: passwordHash,
      roles: ['CUSTOMER'],
      isVerified: Boolean(body.isVerified),
      favouritesProducts: {},
    });

    const authInfo = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      mobileNo: body.mobileNo,
      roles: ['CUSTOMER'],
      isVerified: Boolean(body.isVerified),
      expiresIn,
      _id: user._id,
    }

    const token = JWT.sign(authInfo, JWT_SECRET, { expiresIn });
    this.Ok(ctx, { token, user: { ...authInfo, addresses: [] } }, 'Signup success');
  }
  public handleLogin = async (ctx: Koa.Context) => {
    const body: ILoginBody = ctx.request.body;
    const formErrors = [];
    if (!Validator.isEmail(body.email)) {
      formErrors.push('Email is invalid');
    }
    if (!Validator.isValidPassword(body.password)) {
      formErrors.push('Password is invalid');
    }
    if (formErrors.length) {
      return this.BadRequest(ctx, 'Form is invalid', ERROR_CODE.INVALID_BODY, formErrors);
    }

    const user = await User.findOne({ email: body.email });
    if (!user) {
      return this.BadRequest(ctx, 'User not found');
    }
    if (!EncryptionService.compare(body.password, user.password)) {
      return this.BadRequest(ctx, 'Password is invalid');
    }

    const expiresIn = Date.now() + (typeof process.env.JWT_EXPIRE === 'undefined' ? Config.get<number>('JWT_EXPIRE') : Number(process.env.JWT_EXPIRE));
    const JWT_SECRET = process.env.JWT_SECRET ?? Config.get('JWT_SECRET');
    const authInfo = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobileNo: user.mobileNo,
      roles: user.roles,
      isVerified: Boolean(user.isVerified),
      expiresIn,
      _id: user._id,
    }
    const token = JWT.sign(authInfo, JWT_SECRET, { expiresIn });
    this.Ok(ctx, { token, user: { ...authInfo, addresses: user.addresses } }, 'Login success');
  }
}

export default new AuthController();
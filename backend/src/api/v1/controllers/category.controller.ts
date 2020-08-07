// Libraries
import Koa from 'koa';
import { v4 as UuidV4 } from 'uuid';

// Project files
import { IController, IAddCategoryBody, ICategory } from '@app/types';
import BaseController from '@app/api/v1/controllers/base.controller';
import Validator from '@app/helpers/validator.helpers';
import { ERROR_CODE } from '@app/constants';
import { Category } from '@app/models';

class CategoryController extends BaseController implements IController {
  constructor() {
    super();
    const BASE_PATH = '/category';
    this.routes.push({
      method: 'GET',
      path: BASE_PATH,
      handler: this.getCategories,
    });
    this.routes.push({
      method: 'POST',
      path: BASE_PATH,
      handler: this.addCategory,
    });
  }

  public getCategories = async (ctx: Koa.Context) => {
    const categories = await Category.find({}).then(result => result.map(x => ({ title: x.title, thumbnailImage: x.thumbnailImage, productsAvailable: x.productsIds.length })));
    this.Ok(ctx, { categories }, 'Categories fetched');
  }

  public addCategory = async (ctx: Koa.Context) => {
    const body: IAddCategoryBody = ctx.request.body;
    const formErrors: string[] = [];
    if (Validator.isEmpty(body.title)) {
      formErrors.push('Category name is required');
    }
    if (Validator.isEmpty(body.thumbnailImage)) {
      formErrors.push('Thumbnail image is required');
    }
    if (formErrors.length) {
      return this.BadRequest(ctx, 'Form is invalid', ERROR_CODE.INVALID_BODY, formErrors);
    }

    const categoryBody: ICategory = {
      uuid: UuidV4(),
      thumbnailImage: body.thumbnailImage,
      title: body.title,
      productsIds: [],
    };

    const category = await Category.create(categoryBody);
    this.Ok(ctx, { category }, 'Category added');
  }
}

export default new CategoryController();
// Libraries
import Koa from 'koa';
import { v4 as UuidV4 } from 'uuid';

// Project files
import { IController, IProductAddBody, IProductVariant, IProduct } from '@app/types';
import BaseController from '@app/api/v1/controllers/base.controller';
import Validator from '@app/helpers/validator.helpers';
import { ERROR_CODE } from '@app/constants';
import { Product, Category } from '@app/models';

class ProductController extends BaseController implements IController {
  constructor() {
    super();
    const BASE_PATH = '/product';
    this.routes.push({
      method: 'POST',
      path: BASE_PATH,
      handler: this.addProduct,
    });
    this.routes.push({
      method: 'GET',
      path: BASE_PATH,
      handler: this.getProducts,
    });
    this.routes.push({
      method: 'GET',
      path: `${BASE_PATH}/category/:categoryName`,
      handler: this.getProductByCategory,
    });
  }

  public addProduct = async (ctx: Koa.Context) => {
    const body: IProductAddBody = ctx.request.body;

    const formErrors: string[] = [];
    if (Validator.isEmpty(body.productTitle)) {
      formErrors.push('Product title is required');
    }
    if (Validator.isEmpty(body.thumbnailImage)) {
      formErrors.push('Thumbnail image is required');
    }
    if (Validator.isEmpty(body.description)) {
      formErrors.push('Product description is required');
    }
    if (Validator.isEmpty(body.category)) {
      formErrors.push('Product category is required');
    }
    if (Validator.isEmpty(body.vendor)) {
      formErrors.push('Vendor is required');
    }
    if (Validator.isEmpty(body.originOfProduct)) {
      formErrors.push('Origin of product is required');
    }
    if (!(body.variants || []).length) {
      formErrors.push('Variant is required');
    } else {
      body.variants.forEach((element, index) => {
        if (Validator.isEmpty(element.title)) {
          formErrors.push(`Title is required on ${index + 1} variant`);
        }
        if (Validator.isEmpty(element.barcode)) {
          formErrors.push(`Barcode is required on ${index + 1} variant`);
        }
        if (!(typeof element.listingPrice === 'number' && element.listingPrice > 0)) {
          formErrors.push(`Listing price is required on ${index + 1} variant`);
        }
        if (!(typeof element.originalPrice === 'number' && element.originalPrice > 0)) {
          formErrors.push(`Original price is required on ${index + 1} variant`);
        }
        if (!(typeof element.weight === 'number' && element.weight > 0)) {
          formErrors.push(`Weight is required on ${index + 1} variant`);
        }
        if (!element.weightUnit) {
          formErrors.push(`Weight unit is required on ${index + 1} variant`);
        }
        if (!element.images?.length) {
          formErrors.push('Product images are required');
        } else {
          element.images.forEach((image) => {
            if (Validator.isEmpty(image.src)) {
              formErrors.push(`Image source is required on ${index + 1} variant`);
            }
            if (Validator.isEmpty(image.mediaType)) {
              formErrors.push(`Media type is required on ${index + 1} variant`);
            }
          });
        }
      });
    }

    if (formErrors.length) {
      return this.BadRequest(ctx, 'Form is invalid', ERROR_CODE.INVALID_BODY, formErrors);
    }

    const productId = UuidV4();
    const productVariants: IProductVariant[] = body.variants.map(x => ({
      barcode: x.barcode,
      productId,
      isOutOfStock: false,
      originalPrice: x.originalPrice,
      price: x.listingPrice,
      title: x.title,
      uuid: UuidV4(),
      weight: x.weight,
      weightUnit: x.weightUnit,
    }));

    const images = {};
    body.variants.forEach(element => {
      if (element.images?.length) {
        const matchedProduct = productVariants.find(x => x.title === element.title);
        element.images.forEach(image => {
          if (!images[image.src]) {
            images[image.src] = {
              src: image.src,
              mediaType: image.mediaType,
              variantIds: [],
            }
          }
          images[image.src].productId = matchedProduct.productId;
          images[image.src].uuid = UuidV4();
          images[image.src].variantIds.push(matchedProduct.uuid);
        });
      }
    });

    const productBody: IProduct = {
      productId,
      category: body.category,
      description: body.description,
      disabled: false,
      variants: productVariants,
      title: body.productTitle,
      vendor: body.vendor,
      originOfProduct: body.originOfProduct,
      images: Object.values(images).map((x: any) => ({ ...x, variantIds: [...new Set(x.variantIds)] })),
      thumbnailImage: body.thumbnailImage,
    }

    const product = await Product.create(productBody);
    await Category.updateOne({ title: body.category }, { $addToSet: { productsIds: product._id } });
    this.Created(ctx, { product }, 'Product created');
  }

  public getProducts = async (ctx: Koa.Context) => {
    const products = await Product.find({});
    this.Ok(ctx, { products }, 'Products fetched');
  }

  public getProductByCategory = async (ctx: Koa.Context) => {
    const categoryName = ctx.params.categoryName;
    if (Validator.isEmpty(categoryName)) {
      return this.BadRequest(ctx, 'Form is invalid', ERROR_CODE.INVALID_BODY, ['Category name is required.']);
    }
    const products = await Product.find({ category: categoryName });
    this.Ok(ctx, { products }, 'Products fetched');
  }
}

export default new ProductController();
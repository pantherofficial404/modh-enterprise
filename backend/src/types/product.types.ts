export interface IProduct {
  productId: string;
  title: string;
  description: string;
  category: IProductCategory;
  thumbnailImage: string;
  images: IProductImage[];
  variants: IProductVariant[];
  disabled: boolean;
  vendor: string;
  originOfProduct: IProductOrigin;
}
export interface IProductVariant {
  uuid: string;
  productId: string;
  title: string;
  barcode: string;
  originalPrice: number;
  price: number;
  weight: number;
  weightUnit: IProductWeightUnit;
  isOutOfStock: boolean;
}
export interface IProductImage {
  uuid: string;
  productId: string;
  src: string;
  mediaType: IProductMediaType;
  variantIds: string[];
}
export type IProductMediaType = 'IMAGE' | 'VIDEO';
export type IProductCategory = 'PULSES' | 'HEALTH & BEAUTY' | 'FLOUR' | 'CLEANING & HOUSEHOLD' | 'SNACK & BEVERAGES' | 'NOODLES & SOUCES' | 'RICE' | 'DRYFRUITES' | 'SUGAR & SALT' | 'SPICES' | 'TEA & COFFEE' | 'GHEE & OIL' | 'SPECIAL';
export type IProductWeightUnit = 'KG' | 'LITRE' | 'GRAM' | 'UNIT';
export type IProductOrigin = 'MADE IN INDIA' | 'MAKE IN INDIA' | 'MADE IN CHINA';


export interface IProductAddBody {
  productTitle: string;
  description: string;
  category: IProductCategory;
  variants: {
    title: string;
    barcode: string;
    originalPrice: number;
    listingPrice: number;
    weight: number;
    weightUnit: IProductWeightUnit;
    images: {
      src: string;
      mediaType: IProductMediaType;
    }[];
  }[];
  vendor: string;
  originOfProduct: IProductOrigin;
  thumbnailImage: string;
}
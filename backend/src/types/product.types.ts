export interface IProduct {
  title: string;
  description: string;
  category: IProductCategory;
  image: IProductImage;
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
  id: string;
  uuid: string;
  productId: string;
  src: string;
  mediaType: IProductMediaType;
  variantIds: string[];
}
export type IProductMediaType = 'IMAGE' | 'VIDEO';
export type IProductCategory = 'PULSES' | 'HEALTH & BEAUTY' | 'FLOUR' | 'CLEANING & HOUSEHOLD' | 'SNACK & BEVERAGES' | 'NOODLES & SOUCES' | 'RICE' | 'DRYFRUITES' | 'SUGAR & SALT' | 'SPICES' | 'TEA & COFFEE' | 'GHEE & OIL' | 'SPECIAL';
export type IProductWeightUnit = 'KG' | 'LITRE';
export type IProductOrigin = 'MADE IN INDIA' | 'MAKE IN INDIA' | 'MADE IN CHINA';
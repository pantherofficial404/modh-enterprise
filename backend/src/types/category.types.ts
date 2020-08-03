export interface ICategory {
  uuid: string;
  thumbnailImage: string;
  title: string;
  productsIds?: string[];
}

export interface IAddCategoryBody {
  thumbnailImage: string;
  title: string;
}
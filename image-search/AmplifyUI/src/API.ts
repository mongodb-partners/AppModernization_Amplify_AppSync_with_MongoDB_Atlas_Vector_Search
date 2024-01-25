/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type ItemInput = {
  item_id: string,
  item_name_in_en_us?: string | null,
  main_image_id?: string | null,
  image_id?: string | null,
  height?: number | null,
  width?: number | null,
  path?: string | null,
};

export type Item = {
  __typename: "Item",
  item_id: string,
  item_name_in_en_us?: string | null,
  main_image_id?: string | null,
  image_id?: string | null,
  height?: number | null,
  width?: number | null,
  path?: string | null,
};

export type ImageSearchResult = {
  __typename: "ImageSearchResult",
  item_ids?: Array< string | null > | null,
};

export type AddItemMutationVariables = {
  input: ItemInput,
};

export type AddItemMutation = {
  addItem?:  {
    __typename: "Item",
    item_id: string,
    item_name_in_en_us?: string | null,
    main_image_id?: string | null,
    image_id?: string | null,
    height?: number | null,
    width?: number | null,
    path?: string | null,
  } | null,
};

export type ListItemsQueryVariables = {
  limit?: number | null,
  skip?: number | null,
};

export type ListItemsQuery = {
  listItems?:  Array< {
    __typename: "Item",
    item_id: string,
    item_name_in_en_us?: string | null,
    main_image_id?: string | null,
    image_id?: string | null,
    height?: number | null,
    width?: number | null,
    path?: string | null,
  } | null > | null,
};

export type GetItemByIdQueryVariables = {
  item_id: string,
};

export type GetItemByIdQuery = {
  getItemById?:  {
    __typename: "Item",
    item_id: string,
    item_name_in_en_us?: string | null,
    main_image_id?: string | null,
    image_id?: string | null,
    height?: number | null,
    width?: number | null,
    path?: string | null,
  } | null,
};

export type SearchImageQueryVariables = {
  imagePath: string,
};

export type SearchImageQuery = {
  searchImage?:  {
    __typename: "ImageSearchResult",
    item_ids?: Array< string | null > | null,
  } | null,
};

/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const listItems = /* GraphQL */ `query ListItems($limit: Int, $skip: Int) {
  listItems(limit: $limit, skip: $skip) {
    item_id
    item_name_in_en_us
    main_image_id
    image_id
    height
    width
    path
    __typename
  }
}
` as GeneratedQuery<APITypes.ListItemsQueryVariables, APITypes.ListItemsQuery>;
export const getItemById = /* GraphQL */ `query GetItemById($item_id: ID!) {
  getItemById(item_id: $item_id) {
    item_id
    item_name_in_en_us
    main_image_id
    image_id
    height
    width
    path
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetItemByIdQueryVariables,
  APITypes.GetItemByIdQuery
>;
export const searchImage = /* GraphQL */ `query SearchImage($imagePath: String!) {
  searchImage(imagePath: $imagePath) {
    item_ids
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SearchImageQueryVariables,
  APITypes.SearchImageQuery
>;

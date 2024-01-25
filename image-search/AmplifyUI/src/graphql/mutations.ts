/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const addItem = /* GraphQL */ `mutation AddItem($input: ItemInput!) {
  addItem(input: $input) {
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
` as GeneratedMutation<
  APITypes.AddItemMutationVariables,
  APITypes.AddItemMutation
>;

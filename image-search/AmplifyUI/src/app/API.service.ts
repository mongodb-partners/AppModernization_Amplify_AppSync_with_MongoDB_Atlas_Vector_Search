/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import API, { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { Observable } from "zen-observable-ts";

export type ItemInput = {
  item_id: string;
  item_name_in_en_us?: string | null;
  main_image_id?: string | null;
  image_id?: string | null;
  height?: number | null;
  width?: number | null;
  path?: string | null;
};

export type Item = {
  __typename: "Item";
  item_id: string;
  item_name_in_en_us?: string | null;
  main_image_id?: string | null;
  image_id?: string | null;
  height?: number | null;
  width?: number | null;
  path?: string | null;
};

export type ImageSearchResult = {
  __typename: "ImageSearchResult";
  item_ids?: Array<string | null> | null;
};

export type AddItemMutation = {
  __typename: "Item";
  item_id: string;
  item_name_in_en_us?: string | null;
  main_image_id?: string | null;
  image_id?: string | null;
  height?: number | null;
  width?: number | null;
  path?: string | null;
};

export type ListItemsQuery = {
  __typename: "Item";
  item_id: string;
  item_name_in_en_us?: string | null;
  main_image_id?: string | null;
  image_id?: string | null;
  height?: number | null;
  width?: number | null;
  path?: string | null;
};

export type GetItemByIdQuery = {
  __typename: "Item";
  item_id: string;
  item_name_in_en_us?: string | null;
  main_image_id?: string | null;
  image_id?: string | null;
  height?: number | null;
  width?: number | null;
  path?: string | null;
};

export type SearchImageQuery = {
  __typename: "ImageSearchResult";
  item_ids?: Array<string | null> | null;
};

@Injectable({
  providedIn: "root"
})
export class APIService {
  async AddItem(input: ItemInput): Promise<AddItemMutation> {
    const statement = `mutation AddItem($input: ItemInput!) {
        addItem(input: $input) {
          __typename
          item_id
          item_name_in_en_us
          main_image_id
          image_id
          height
          width
          path
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <AddItemMutation>response.data.addItem;
  }
  async ListItems(
    limit?: number,
    skip?: number
  ): Promise<Array<ListItemsQuery>> {
    const statement = `query ListItems($limit: Int, $skip: Int) {
        listItems(limit: $limit, skip: $skip) {
          __typename
          item_id
          item_name_in_en_us
          main_image_id
          image_id
          height
          width
          path
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (skip) {
      gqlAPIServiceArguments.skip = skip;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <Array<ListItemsQuery>>response.data.listItems;
  }
  async GetItemById(item_id: string): Promise<GetItemByIdQuery> {
    const statement = `query GetItemById($item_id: ID!) {
        getItemById(item_id: $item_id) {
          __typename
          item_id
          item_name_in_en_us
          main_image_id
          image_id
          height
          width
          path
        }
      }`;
    const gqlAPIServiceArguments: any = {
      item_id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetItemByIdQuery>response.data.getItemById;
  }
  async SearchImage(imagePath: string): Promise<SearchImageQuery> {
    const statement = `query SearchImage($imagePath: String!) {
        searchImage(imagePath: $imagePath) {
          __typename
          item_ids
        }
      }`;
    const gqlAPIServiceArguments: any = {
      imagePath
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SearchImageQuery>response.data.searchImage;
  }
}

/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getAnswer = /* GraphQL */ `query GetAnswer($question: String!) {
  getAnswer(question: $question)
}
` as GeneratedQuery<APITypes.GetAnswerQueryVariables, APITypes.GetAnswerQuery>;
export const getAnswerBasedOnCategory = /* GraphQL */ `query GetAnswerBasedOnCategory($question: String!, $category: String!) {
  getAnswerBasedOnCategory(question: $question, category: $category)
}
` as GeneratedQuery<
  APITypes.GetAnswerBasedOnCategoryQueryVariables,
  APITypes.GetAnswerBasedOnCategoryQuery
>;
export const getAnswerBasedOnCategoryFromTitan = /* GraphQL */ `query GetAnswerBasedOnCategoryFromTitan(
  $question: String!
  $category: String!
) {
  getAnswerBasedOnCategoryFromTitan(question: $question, category: $category)
}
` as GeneratedQuery<
  APITypes.GetAnswerBasedOnCategoryFromTitanQueryVariables,
  APITypes.GetAnswerBasedOnCategoryFromTitanQuery
>;

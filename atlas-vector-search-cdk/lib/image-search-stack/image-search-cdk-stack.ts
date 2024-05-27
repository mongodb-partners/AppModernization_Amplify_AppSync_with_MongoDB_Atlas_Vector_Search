import * as cdk from 'aws-cdk-lib';
const { SecretValue } = cdk;
import { Construct } from 'constructs';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from 'aws-cdk-lib/aws-iam';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import { Duration } from 'aws-cdk-lib/core';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3Notifications from 'aws-cdk-lib/aws-s3-notifications';
import * as Amplify from '@aws-cdk/aws-amplify';
import * as fs from 'fs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as sagemaker from 'aws-cdk-lib/aws-sagemaker';

const clusterConnectionString = cdk.Fn.importValue('ClusterConnectionString');
const dbUser = cdk.Fn.importValue('dbUser');
const dbPassword = cdk.Fn.importValue('dbPassword');
const bucketName = cdk.Fn.importValue('s3BucketName');


interface GlobalArgs {
  ATLAS_PUBLIC_KEY: string;
  ATLAS_PRIVATE_KEY: string;
  orgId: string;
  projectId: string;
  clusterName: string;
  region: string;
  profile: string;
  instanceSize: string;
  dataApi: string;
  PDFExtractInjestsEnv: Record<string, string>;
  QueryAndAnsEnv: Record<string, string>;
  VectorSearchEnv: Record<string, string>;
  ClassifyDataEnv: Record<string, string>;
  ImageSearchAppSync: Record<string, string>;
  [key: string]: any;
}

interface CustomStackProps extends cdk.StackProps {
  globalArgs: GlobalArgs;
}

export class ImageSearchCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CustomStackProps) {
    super(scope, id, props);
    const { globalArgs } = props;
    // Reference the existing S3 bucket by its name
    const bucket = s3.Bucket.fromBucketName(this, 'ImageSearch_S3', bucketName);


    globalArgs.VectorSearchEnv.CLUSTER_CONN_STRING = clusterConnectionString;
    globalArgs.VectorSearchEnv.DB_USER = dbUser;
    globalArgs.VectorSearchEnv.DB_PWD = dbPassword;
    globalArgs.VectorSearchEnv.S3_BUCKET = bucket.bucketName

    globalArgs.ClassifyDataEnv.CLUSTER_CONN_STRING = clusterConnectionString;
    globalArgs.ClassifyDataEnv.DB_USER = dbUser;
    globalArgs.ClassifyDataEnv.DB_PWD = dbPassword;
    globalArgs.ClassifyDataEnv.S3_BUCKET = bucket.bucketName

    const url = new URL(globalArgs.dataApi);
    const BASE_DATA_URL = url.origin;
    const MDB_FIND_PATH = `${url.pathname}/action/find`;
    globalArgs.ImageSearchAppSync.MDB_FIND_PATH = MDB_FIND_PATH


    // Define the policy statements
    const s3PolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['s3:GetObject', 's3:PutObject'],
      resources: ['*'],
    });

    const sagemakerPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['sagemaker:InvokeEndpoint'],
      resources: ['*'],
    });

    const logsCreateLogGroupPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['logs:CreateLogGroup'],
      resources: ['*'],
    });

    const logsPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
      resources: ['*'],
    });

    const textractPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['textract:StartDocumentTextDetection', 'textract:GetDocumentTextDetection'],
      resources: ['*'],
    });

    const bedrockPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['bedrock:InvokeModel'],
      resources: ['arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v1'],
    });

    const bedrockPolicy1 = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['bedrock:InvokeModel'],
      resources: ['arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-text-express-v1'],
    });

    const bedrockPolicy2 = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['bedrock:InvokeModel'],
      resources: ['arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2'],
    });

    const VectorSearchHandler = new lambda.Function(this, "ImageSearch_Lambda_1", {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset("resources/image-search/Lambda/vectorsearch/lambdapackage"),
      handler: "index.handler",
      environment: globalArgs.VectorSearchEnv,
      initialPolicy: [
        s3PolicyStatement,
        sagemakerPolicyStatement,
        logsCreateLogGroupPolicyStatement,
        logsPolicyStatement
      ],
      timeout: Duration.seconds(363)
    });

    const ClassifyDataHandler = new lambda.Function(this, "ImageSearch_Lambda_2", {
      runtime: lambda.Runtime.PYTHON_3_12,
      code: lambda.Code.fromAsset("resources/image-search/Lambda/classifydata/lambdapackage"),
      handler: "main.lambda_handler",
      environment: globalArgs.ClassifyDataEnv,
      initialPolicy: [
        textractPolicy,
        bedrockPolicy,
        bedrockPolicy1,
        bedrockPolicy2
      ],
      timeout: Duration.seconds(720)
    });


    const api = new appsync.GraphqlApi(this, 'ImageSearch_api', {
      name: 'AVS-IMG-SEARCH-APPSYNC',
      definition: appsync.Definition.fromFile('resources/image-search/AppSync/imagesearch/schema.json'),
      environmentVariables: globalArgs.ImageSearchAppSync
    });

    const VSLambdaDataSource = new appsync.LambdaDataSource(this, 'ImageSearch_DataSource_1', {
      api: api,
      lambdaFunction: VectorSearchHandler,
    });

    const searchImageResolver = new appsync.Resolver(this, 'ImageSearch_Resolver_1', {
      api,
      dataSource: VSLambdaDataSource,
      typeName: 'Query',
      fieldName: 'searchImage',
      requestMappingTemplate: appsync.MappingTemplate.fromFile('resources/image-search/AppSync/imagesearch/searchImage/request.vtl'),
      responseMappingTemplate: appsync.MappingTemplate.fromFile('resources/image-search/AppSync/imagesearch/searchImage/response.vtl'),
    });

    const VSHTTPDataSource = new appsync.HttpDataSource(this, 'ImageSearch_DataSource_2', {
      api: api,
      endpoint: BASE_DATA_URL,
      name: 'mdbdataapi'
    });

    const VSgetItemById = new appsync.AppsyncFunction(this, 'ImageSearch_Function_1', {
      name: 'getItemById',
      api,
      dataSource: VSHTTPDataSource,
      code: appsync.Code.fromAsset("resources/image-search/AppSync/imagesearch/getItemById/getItemById_func.js"),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });


    const pipelineResolver = new appsync.Resolver(this, 'ImageSearch_Resolver_2', {
      api,
      typeName: 'Query',
      fieldName: 'getItemById',
      pipelineConfig: [VSgetItemById],
      code: appsync.Code.fromAsset("resources/image-search/AppSync/imagesearch/getItemById/resolver.js"),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });


    // Print API information
    new cdk.CfnOutput(this, 'ImageSearch-graphqlEndpoint', {
      value: api.graphqlUrl,
      description: 'GraphQL API Endpoint',
      exportName: 'ImageSearch-graphqlEndpoint'
    });

    // Print API information
    new cdk.CfnOutput(this, 'ImageSearch-apiId', {
      value: api.apiId,
      description: 'AppSync API ID',
      exportName: 'ImageSearch-apiId'
    });

    new cdk.CfnOutput(this, 'ImageSearch-project-region', {
      value: this.region,
      description: 'AppSync Region',
      exportName: 'ImageSearch-project-region'
    });

    new cdk.CfnOutput(this, 'ImageSearch-region', {
      value: this.region,
      description: 'AppSync Region',
      exportName: 'ImageSearch-region'
    });

    new cdk.CfnOutput(this, 'ImageSearch-authenticationType', {
      value: 'API_KEY', // Since you are using API_KEY authentication type
      description: 'AppSync Authentication Type',
      exportName: 'ImageSearch-authenticationType'
    });

    new cdk.CfnOutput(this, 'ImageSearch-apiKey', {
      value: api.apiKey || 'No API Key generated', // Check if an API key was generated
      description: 'AppSync API Key',
      exportName: 'ImageSearch-apiKey'
    });

    new cdk.CfnOutput(this, 'ImageSearchS3Bucket', {
      value: bucket.bucketName, // Check if an API key was generated
      description: 'S3 bucket Name',
      exportName: 'ImageSearchS3Bucket'
    });

    new cdk.CfnOutput(this, 'ImageSearchS3Region', {
      value: this.region, // Check if an API key was generated
      description: 'S3 bucket Name',
      exportName: 'ImageSearchS3Region'
    });
    new cdk.CfnOutput(this, 'ImageSearchS3Arn', {
      value: bucket.bucketArn, // Check if an API key was generated
      description: 'S3 ARN',
      exportName: 'ImageSearchS3Arn'
    });
  }
}

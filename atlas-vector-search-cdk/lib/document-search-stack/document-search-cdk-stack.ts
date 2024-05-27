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
  [key: string]: any;
}

interface CustomStackProps extends cdk.StackProps {
  globalArgs: GlobalArgs;
}

export class DocumentSearchCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CustomStackProps) {
    super(scope, id, props);
    const { globalArgs } = props;

  
    globalArgs.PDFExtractInjestsEnv.CLUSTER_CONN_STRING = clusterConnectionString;
    globalArgs.PDFExtractInjestsEnv.DB_USER = dbUser;
    globalArgs.PDFExtractInjestsEnv.DB_PWD = dbPassword;
    globalArgs.QueryAndAnsEnv.CLUSTER_CONN_STRING = clusterConnectionString;
    globalArgs.QueryAndAnsEnv.DB_USER = dbUser;
    globalArgs.QueryAndAnsEnv.DB_PWD = dbPassword;


    const bucket = s3.Bucket.fromBucketName(this, 'S3_DocumentSearch', bucketName);

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

    const bedrockPolicy3 = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['bedrock:InvokeModel'],
      resources: ['arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v1'],
    });


    const PDFExtractInjestsHandler = new lambda.Function(this, "PDFExtractLambda_DocumentSearch", {
      runtime: lambda.Runtime.PYTHON_3_12,
      code: lambda.Code.fromAsset("resources/document-search/Lambda/pdfextract_ingests/lambdapackage"),
      handler: "main.lambda_handler",
      environment: globalArgs.PDFExtractInjestsEnv,
      initialPolicy: [
        textractPolicy,
        bedrockPolicy,
      ],
      timeout: Duration.seconds(180)
    });


    const QueryAndAnsHandler = new lambda.Function(this, "QueryAndAnsLambda_DocumentSearch", {
      runtime: lambda.Runtime.PYTHON_3_12,
      code: lambda.Code.fromAsset("resources/document-search/Lambda/query_and_ans/lambdapackage"),
      handler: "main.lambda_handler",
      environment: globalArgs.QueryAndAnsEnv,
      initialPolicy: [
        textractPolicy,
        bedrockPolicy1,
        bedrockPolicy2,
        bedrockPolicy3,
      ],
      timeout: Duration.seconds(180)
    });


    // Create a publicly accessible S3 bucket
    // const bucket = new s3.Bucket(this, 'AVS-S3', {
    //   removalPolicy: cdk.RemovalPolicy.DESTROY,
    //   blockPublicAccess: {
    //     blockPublicAcls: false,
    //     blockPublicPolicy: false,
    //     ignorePublicAcls: false,
    //     restrictPublicBuckets: false,
    //   },
    //   publicReadAccess: true,
    //   cors: [
    //     {
    //       allowedOrigins: ['*'],
    //       allowedMethods: [s3.HttpMethods.GET,s3.HttpMethods.PUT,s3.HttpMethods.POST],
    //       allowedHeaders: ['*']
    //     }
    //   ],
    // });

    // Create a prefix inside the S3 bucket with the Lambda function's name for PDFExtractInjestsHandler
    const pdfExtractInjestsPrefix = `pdfextract/`;
    
    // Create a prefix inside the S3 bucket with the Lambda function's name for QueryAndAnsHandler
    const queryAndAnsPrefix = `queryAndAns/`;

    // Create an S3 event notification for the PDFExtractInjestsHandler Lambda function
    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3Notifications.LambdaDestination(PDFExtractInjestsHandler), {
      prefix: pdfExtractInjestsPrefix,
    });

    // Create an S3 event notification for the QueryAndAnsHandler Lambda function
    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3Notifications.LambdaDestination(QueryAndAnsHandler), {
      prefix: queryAndAnsPrefix,
    });

    
  
    const api = new appsync.GraphqlApi(this, 'api', {
      name: 'AVS-APPSYNC',
      definition: appsync.Definition.fromFile('resources/document-search/AppSync/questionanswersapp/schema.json'),
    });

    const lambdaDataSource = new appsync.LambdaDataSource(this, 'datasource_DocumentSearch', {
      api: api,
      lambdaFunction: QueryAndAnsHandler,
    });

    const pipelineResolver = new appsync.Resolver(this, 'pipelineResolver_DocumentSearch', {
      api,
      dataSource: lambdaDataSource,
      typeName: 'Query',
      fieldName: 'getAnswer',
      requestMappingTemplate: appsync.MappingTemplate.fromFile('resources/document-search/AppSync/questionanswersapp/request.vtl'),
      responseMappingTemplate: appsync.MappingTemplate.fromFile('resources/document-search/AppSync/questionanswersapp/response.vtl'),
    });
    const pipelineResolver2 = new appsync.Resolver(this, 'pipelineResolver2_DocumentSearch', {
      api,
      dataSource: lambdaDataSource,
      typeName: 'Query',
      fieldName: 'getAnswerBasedOnCategory',
      requestMappingTemplate: appsync.MappingTemplate.fromFile('resources/document-search/AppSync/questionanswersapp/request.vtl'),
      responseMappingTemplate: appsync.MappingTemplate.fromFile('resources/document-search/AppSync/questionanswersapp/response.vtl'),
    });

    // const appsyncFunction = new appsync.AppsyncFunction(this, 'function', {
    //   name: 'appsync_function',
    //   api,
    //   dataSource: lambdaDataSource,
    //   requestMappingTemplate: appsync.MappingTemplate.fromFile('resources/document-search/AppSync/questionanswersapp/request.vtl'),
    //   responseMappingTemplate: appsync.MappingTemplate.fromFile('resources/document-search/AppSync/questionanswersapp/response.vtl'),
    // });

    // Print API information
    new cdk.CfnOutput(this, 'DocumentSearch-graphqlEndpoint', {
      value: api.graphqlUrl,
      description: 'GraphQL API Endpoint',
      exportName: 'DocumentSearch-graphqlEndpoint'
    });

    // Print API information
    new cdk.CfnOutput(this, 'DocumentSearch-apiId', {
      value: api.apiId,
      description: 'AppSync API ID',
      exportName: 'DocumentSearch-apiId'
    });

    new cdk.CfnOutput(this, 'DocumentSearch-project-region', {
      value: this.region,
      description: 'AppSync Region',
      exportName: 'DocumentSearch-project-region'
    });

    new cdk.CfnOutput(this, 'DocumentSearch-appsync-region', {
      value: this.region,
      description: 'AppSync Region',
      exportName: 'DocumentSearch-appsync-region'
    });

    new cdk.CfnOutput(this, 'DocumentSearch-authenticationType', {
      value: 'API_KEY', // Since you are using API_KEY authentication type
      description: 'AppSync Authentication Type',
      exportName: 'DocumentSearch-authenticationType'
    });

    new cdk.CfnOutput(this, 'DocumentSearch-apiKey', {
      value: api.apiKey || 'No API Key generated', // Check if an API key was generated
      description: 'AppSync API Key',
      exportName: 'DocumentSearch-apiKey'
    });

    new cdk.CfnOutput(this, 'DocumentSearchS3Bucket', {
      value: bucket.bucketName, // Check if an API key was generated
      description: 'S3 bucket Name',
      exportName: 'DocumentSearchS3Bucket'
    });

    new cdk.CfnOutput(this, 'DocumentSearchS3Region', {
      value: this.region, // Check if an API key was generated
      description: 'S3 bucket Name',
      exportName: 'DocumentSearchS3Region'
    });
    new cdk.CfnOutput(this, 'DocumentSearchS3Arn', {
      value: bucket.bucketArn, // Check if an API key was generated
      description: 'S3 ARN',
      exportName: 'DocumentSearchS3Arn'
    });

  }
}


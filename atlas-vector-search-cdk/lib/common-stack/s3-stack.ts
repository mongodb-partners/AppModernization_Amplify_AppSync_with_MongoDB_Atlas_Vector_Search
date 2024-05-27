import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3Notifications from 'aws-cdk-lib/aws-s3-notifications';


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

export class S3Stack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: CustomStackProps) {
      super(scope, id, props);

    const bucket = new s3.Bucket(this, 'S3_1', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
        blockPublicAccess: {
          blockPublicAcls: false,
          blockPublicPolicy: false,
          ignorePublicAcls: false,
          restrictPublicBuckets: false,
        },
        publicReadAccess: true,
        cors: [
          {
            allowedOrigins: ['*'],
            allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST],
            allowedHeaders: ['*']
          }
        ],
      });

      new cdk.CfnOutput(this, 's3BucketName', {
        value: bucket.bucketName, // Check if an API key was generated
        description: 'S3 bucket Name',
        exportName: 's3BucketName'
      });
  
      new cdk.CfnOutput(this, 's3RegionName', {
        value: this.region, // Check if an API key was generated
        description: 'S3 Region Name',
        exportName: 's3RegionName'
      });
      new cdk.CfnOutput(this, 's3ArnId', {
        value: bucket.bucketArn, // Check if an API key was generated
        description: 'S3 ARN',
        exportName: 's3ArnId'
      });
  }
}

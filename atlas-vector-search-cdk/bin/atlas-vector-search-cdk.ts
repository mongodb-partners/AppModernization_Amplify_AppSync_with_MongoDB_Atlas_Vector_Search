#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ClusterStack } from '../lib/common-stack/mongo-atlas-cluster-stack';
import { DocumentSearchIndexStack } from '../lib/document-search-stack/mongo-atlas-searchindex-stack';
import { DocumentSearchCdkStack } from '../lib/document-search-stack/document-search-cdk-stack';
import { ImageSearchIndexStack } from '../lib/image-search-stack/mongo-atlas-searchindex-stack';
import { ImageSearchCdkStack } from '../lib/image-search-stack/image-search-cdk-stack';
import * as fs from 'fs';
import { S3Stack } from '../lib/common-stack/s3-stack';

const app = new cdk.App();

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

function readGlobalArgs(): GlobalArgs {
  const globalArgsPath = 'global-args.json';
  try {
    const globalArgsContent = fs.readFileSync(globalArgsPath, 'utf8');
    return JSON.parse(globalArgsContent);
  } catch (error) {
    console.error('Error reading or parsing global-args.json:', error);
    throw error; // Throw the error to indicate failure
  }
}

// Read global arguments
const globalArgs = readGlobalArgs();

// Pass global arguments to each stack
new ClusterStack(app, 'avs-atlas-stack', { globalArgs } as CustomStackProps);
new S3Stack(app, 'avs-s3-stack', { globalArgs } as CustomStackProps);
new DocumentSearchCdkStack(app, 'avs-document-search-stack', { globalArgs } as CustomStackProps);
new DocumentSearchIndexStack(app, 'avs-atlas-documentsearchindex-stack', { globalArgs } as CustomStackProps);
new ImageSearchCdkStack(app, 'avs-image-search-stack', { globalArgs } as CustomStackProps);
new ImageSearchIndexStack(app, 'avs-atlas-imagesearchindex-stack', { globalArgs } as CustomStackProps);

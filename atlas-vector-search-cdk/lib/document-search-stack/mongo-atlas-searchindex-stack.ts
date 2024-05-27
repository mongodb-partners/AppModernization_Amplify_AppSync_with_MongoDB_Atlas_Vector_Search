import * as fs from 'fs';

// This example creates a project and a cluster in Atlas using the L1 resources.
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CfnSearchIndex} from 'awscdk-resources-mongodbatlas';

interface AtlasStackProps {
  readonly orgId: string;
  readonly profile: string;
  readonly projectId: string;
  readonly clusterName: string;
  readonly clusterType: string;
  readonly instanceSize: string;
  readonly region: string;
}

const searchIndexDefaults = {
  profile: "default",
  name: "documentsearch",
  collectionName:"pdfextract",
  dbName:"vectorsearch"
};

// Read mappings from the JSON file
const mappingsPath = 'resources/document-search/Mongodb/searchindex.json';
const mappingsContent = fs.readFileSync(mappingsPath, 'utf8');
const mappings = JSON.parse(mappingsContent);

export class DocumentSearchIndexStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const atlasProps = this.readGlobalArgs();

    //  Create new search Index
    const mySearchIndex = new CfnSearchIndex(this, 'searchindex', {
      // profile: searchIndexDefaults.profile,
      projectId: atlasProps.projectId,
      clusterName: atlasProps.clusterName,
      name: searchIndexDefaults.name,
      collectionName: searchIndexDefaults.collectionName,
      database: searchIndexDefaults.dbName,
      searchAnalyzer: 'lucene.standard',
      analyzer: 'lucene.standard',
      mappings: {
        fields: JSON.stringify(mappings),
        dynamic: true,
      },
    });
  }

  readGlobalArgs(): AtlasStackProps {
    const globalArgsPath = 'global-args.json';
    let globalArgs: AtlasStackProps = {
      orgId: '',
      profile: 'default',
      projectId: '',
      clusterName: 'atlas-vector-search-cluster',
      clusterType: 'REPLICASET',
      instanceSize: 'M0',
      region: 'US_EAST_1',
    };

    try {
      const globalArgsContent = fs.readFileSync(globalArgsPath, 'utf8');
      const parsedArgs: Partial<AtlasStackProps> = JSON.parse(globalArgsContent);

      if (!parsedArgs.orgId) {
        throw new Error('Missing orgId property in global-args.json');
      }
      if (!parsedArgs.projectId) {
        throw new Error('Missing projectId property in global-args.json');
      }

      globalArgs = {
        ...globalArgs,
        ...parsedArgs
      };
    } catch (error) {
      console.error('Error reading or parsing global-args.json:', error);
    }

    return globalArgs;
  }
}

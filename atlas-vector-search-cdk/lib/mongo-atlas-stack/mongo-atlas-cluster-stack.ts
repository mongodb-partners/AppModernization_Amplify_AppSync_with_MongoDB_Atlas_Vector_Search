import * as fs from 'fs';
// This example creates a project and a cluster in Atlas using the L1 resources.
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CfnSearchIndex, CfnProject, CfnCluster, AdvancedRegionConfigProviderName, CfnDatabaseUser, CfnDatabaseUserProps } from 'awscdk-resources-mongodbatlas';

interface AtlasStackProps {
  readonly orgId: string;
  readonly profile: string;
  readonly projectId: string;
  readonly clusterName: string;
  readonly clusterType: string;
  readonly instanceSize: string;
  readonly region: string;
}

const dbDefaults = {
  profile: "default",
  dbName: "admin",
  username: "avs-cdk-user",
  password: "avs-cdk-pwd",
  roles: [
    {
      roleName: "readWriteAnyDatabase",
      databaseName: "admin",
    },
  ],
};

export class ClusterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const atlasProps = this.readGlobalArgs();

    const clusterRes = new CfnCluster(this, 'ClusterResource', {
      name: atlasProps.clusterName,
      projectId: atlasProps.projectId,
      profile: atlasProps.profile,
      clusterType: atlasProps.clusterType,
      backupEnabled: true,
      pitEnabled: false,
      replicationSpecs: [{
        numShards: 1,
        advancedRegionConfigs: [{
          electableSpecs: {
            ebsVolumeType: "STANDARD",
            instanceSize: atlasProps.instanceSize,
            nodeCount: 3,
          },
          priority: 7,
          regionName: atlasProps.region,
        }]
      }]
    });

    // Create a new MongoDB Atlas Database User
    const mDBUser = new CfnDatabaseUser(this, "db-user", {
      profile: dbDefaults.profile,
      databaseName: dbDefaults.dbName,
      projectId: atlasProps.projectId,
      username: dbDefaults.username,
      roles: dbDefaults.roles,
      password: dbDefaults.password,
    });
    
    new cdk.CfnOutput(this, 'ClusterConnectionString', {
      value: clusterRes.connectionStrings.standardSrv || "No Conn String",
      description: 'Cluster Connection String',
      exportName: 'ClusterConnectionString'
    });

    new cdk.CfnOutput(this, 'dbUser', {
      value: dbDefaults.username,
      description: 'dbUser',
      exportName: 'dbUser'
    });

    new cdk.CfnOutput(this, 'dbPassword', {
      value: dbDefaults.password,
      description: 'dbPassword',
      exportName: 'dbPassword'
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



